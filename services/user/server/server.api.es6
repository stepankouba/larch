import RethinkDb from 'rethinkdbdash';
import { Service } from '../../lib/';
import Auth from './server.auth.es6';
import isEmail from 'isEmail';
import OAuth from 'oauth';
import https from 'https';

let oauth;
const r = RethinkDb();

const user = {
	/**
	 * returns current user
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	getCurrent(req, res, next) {
		res.json({user: req.user});
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

		delete req.user;

		Auth.logout(username)
			.then(() => res.json({msg: 'logged out'}))
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
		const availableFields = ['name', 'auths', 'settings'];
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
		if (!user.name || !user.username || !user.password) {
			return next({responseCode: 400, msg: 'signin not properly called'});
		}

		if (!isEmail(user.username)) {
			return next({responseCode: 400, msg: 'username is not an email'});
		}

		if (!Auth.isPassword(user.password)) {
			return next({responseCode: 400, msg: 'wrong password set'});
		}

		Auth.signin(user)
			.then(result => {
				delete user.password;
				delete user.login;

				return res.json({responseCode: 200, msg: 'user created', user});
			})
			.catch(err => {
				if (err.message.startsWith('existing user')) {
					return next({responseCode: 400, msg: 'existing user'});
				} else {
					return next(err);
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
		const name = req.params.name;

		// get source object
		const options = {
			hostname: 'localhost',
			port: 9101,
			path: `/api/source/${name}`,
			rejectUnauthorized: false,
			method: 'GET'
		};

		const request = https.request(options, response => {
			if (response.statusCode !== 200) {
				return next(response);
			}

			response.on('data', data => {
				const source = JSON.parse(data)[0];

				// create oauth after receiving the source
				oauth = new OAuth.OAuth2(
					source.clientId,
					source.clientSecret,
					source.baseUrl,
					source.authorizePath,
					source.accessTokenPath,
					source.customHeaders
				);

				const authURL = oauth.getAuthorizeUrl(source.authorizeUrl);

				return res.json({url: authURL});
			});
		});

		request.end();
		request.on('error', err => next(err));
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
		const code = req.query.code;
		const source = req.query.source;
		// TODO: remove this testing user
		const user = req.user || {id: 'd77158fd-4b64-498a-be3d-e88777958223'};

		const conf = Service.instance.conf;

		if (!code || !source) {
			return next({responseCode: 404,msg: 'no code or source specified for the callback'});
		}

		function getToken() {
			return new Promise((resolve, reject) => {
				oauth.getOAuthAccessToken(
					code,
					{},
					(e, accessToken, refreshToken, results) => {
						if (e) {
							return reject(e);
						} else if (results.error) {
							return reject(results);
						}
						resolve(accessToken);

					}
				);
			});
		}

		getToken()
			.then(token => {
				const update = {settings: {sources: {}}};
				update.settings.sources[source] = token;

				r.db(conf.db.database)
					.table('users')
					.get(user.id)
					.update(update)
					.run()
					.then(result => res.json({token}))
					.catch(err => next(err));
					// .finally(() => r.getPool().drain());
			})
			// store the token in user object
			.catch(err => next(err));
	}
};

export default user;
