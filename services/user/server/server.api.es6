import RethinkDb from 'rethinkdbdash';
import { Service } from '../../lib/';
import Auth from './server.auth.es6';
import isEmail from 'isEmail';
import passport from 'passport';
import strategies from './server.strategies.es6';
import restler from 'restler';

const r = RethinkDb();

const user = {
	/**
	 * returns current user
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	getCurrent(req, res, next) {
		const conf = Service.instance.conf;
		const user = req.user;

		r.db(conf.db.database)
			.table('users')
			.get(user.id)
			.run()
			.then(user => {
				delete user.login;
				delete user.password;

				return res.json({user});
			})
			.catch(err => next(err));
	},
	/**
	 * login user and if corret
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	login(req, res, next) {
		if (!req.query.username || !req.query.password) {
			return next({responseCode: 400, msg: 'no username or password specified'});
		}

		const username = req.query.username;
		const password = req.query.password;

		Auth.login(username, password)
			.then(data => res.json(data))
			.catch(err => {
				if (err === false) {
					return next({responseCode: 401, msg: 'wrong username and / or password'});
				} else {
					return next(err);
				}
			});
	},
	/**
	 * logout
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	logout(req, res, next) {
		const username = req.user.username;

		if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
			return next({responseCode: 401, msg: 'worng authorization of logout'});
		}
		const token = req.headers.authorization.split(' ')[1];;

		Auth.logout(username, token)
			.then(() => {
				delete req.user;
				return res.json({responseCode: 200, msg: 'logged out'});
			})
			.catch(err => next(err));
	},
	/**
	 * update only allowed properties (name, auths and settings)
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	update(req, res, next) {
		const obj = req.body;
		const availableFields = ['settings'];
		const update = {};
		const conf = Service.instance.conf;

		Object.keys(obj).forEach(key => {
			if (availableFields.indexOf(key) > -1) {
				update[key] = obj[key];
			}
		});

		if (Object.keys(update).length === 0) {
			return res.json({msg: 'nothing to update'});
		}

		r.db(conf.db.database)
			.table('users')
			.get(req.user.id)
			.update(update, {returnChanges: 'always'})
			.run()
			.then(result => {
				const user = result.changes[0].new_val;
				delete user.login;
				delete user.password;

				return Promise.resolve(user);
			})
			.then(Auth.createUserAndToken)
			.then(result => res.json(result))
			.catch(err => next(err));
			// .finally(() => r.getPool().drain());

	},
	/**
	 * sign in new user
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	signin(req, res, next) {
		// check posted values
		const user = req.body;
		if (!user.username || !user.password) {
			return next({responseCode: 400, msg: 'MISSING_DATA'});
		}

		if (!isEmail(user.username)) {
			return next({responseCode: 400, msg: 'INVALID_EMAIL'});
		}

		if (!Auth.isPassword(user.password)) {
			return next({responseCode: 400, msg: 'INVALID_PASS'});
		}

		Auth.signin(user)
			.then(result => res.json(result))
			.catch(err => {
				if (err.message.startsWith('existing user')) {
					return next({responseCode: 400, msg: 'EXISTING_USER_ERR'});
				} else {
					return next({responseCode: 400, msg: 'GENERAL_ERR'}, err);
				}
			});
	},
	confirm(req, res, next) {
		const {hash, password} = req.query;

		if (!hash || !password) {
			return next({responseCode: 400, msg: 'no hash or password specified'});
		}

		Auth.confirm(hash, password)
			.then(result => res.json(result))
			.catch(err => {
				if (err === false) {
					return next({responseCode: 400, msg: 'nothing to confirm'});
				} else {
					return next(err);
				}
			});
	},
	/**
	 * create authorization for particular source for a user
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	authSource(req, res, next) {
		const source = req.params.name;
		const conf = Service.instance.conf;
		const logger = Service.instance.server.logger;
		const user = req.params.user;

		if (!user) {
			return next({responseCode: 404, msg: 'no user id specified'});
		}

		function getUser() {
			return req.query.user;
		}

		// create strategy only when needed
		// this goes a little bit into internals of passportjs
		if (!passport._strategies[source]) {
			// get trategy settings from
			restler.get(`https://localhost:9101/api/source/${source}`,
				{rejectUnauthorized: false})
				.on('complete', data => {
					logger.debug('received source definition', data);
					// get source settings
					const settings = data[0];
					strategies[source].settings = settings;
					settings.params.passReqToCallback = true;

					passport.use(source, new strategies[source].Strategy(
						settings.params,
						(req, accessToken, refreshToken, profile, done) => {
							logger.debug(`received access token ${accessToken} with profile`, profile.username);

							const update = {
								id: r.uuid(),
								source,
								token: accessToken,
								createdAt: new Date(),
								name: profile.username
							};

							r.db(conf.db.database)
								.table('users')
								.get(req.params.user)
								.update({
									sources: r.row('sources').append(update)
								}, {nonAtomic: true})
								.run()
								.then(result => done(null, accessToken))
								.catch(err => next(err));
						})
					);

					passport.authenticate(source, {
						callbackURL: `https://localhost:9101/api/user/${user}/auth/${source}/callback`
					})(req, res);
				}
			);
		} else {
			passport.authenticate(source,{
				callbackURL: `https://localhost:9101/api/user/${user}/auth/${source}/callback`
			})(req, res);
		}
	},
	/**
	 * [authSourceCallback description]
	 * called with /url?code=xxxx&source={source name}
	 * source name has to be set in Source.authorizeUrl definitino
	 *
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	authSourceCallback(req, res, next) {
		const source = req.params.name;
		const user = req.params.user;

		if (!source || !user) {
			return next({responseCode: 404,msg: 'no source or user specified for the callback'});
		}

		// auth callback
		passport.authenticate(source, (err, user) => {
			if (err) {
				res.redirect('http://localhost:3333/build/auth.html?result=fail');
			} else {
				res.redirect('http://localhost:3333/build/auth.html?result=OK');
			}
		})(req, res);
	}
};

export default user;
