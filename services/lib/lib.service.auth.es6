import jsonwebtoken from 'jsonwebtoken';
import jwt from 'express-jwt';
import RethinkDB from 'rethinkdbdash';

const SECRET = 'sleeeeppppppiiiiiinnnnnngggggg';
const EXPIRE_IN_MINUTES = 5 * 24 * 60;

const Auth = {
	database: 'larch_users',
	init(env) {
		const c = require('../user/local.json');
		this.database = c.environments[env].db.database;
	},
	/**
	 * this defines jwt middleware for the secure API's
	 * @type {Function}
	 */
	secure: jwt({
		secret: SECRET,
		isRevoked(req, payload, done) {
			const r = RethinkDB();

			let token;
			if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
				token = req.headers.authorization.split(' ')[1];
			}

			r.db(Auth.database)
				.table('tokens')
				.filter({username: payload.username, token})
				.run()
				.then(result => done(null, result.length === 0))
				.catch(err => done(err))
				.finally(() => r.getPool().drain());
		}
	}),
	/**
	 * creates a token if required
	 * @param  {Object} payload anything what should be encrypted into the token
	 * @return {string} token
	 */
	createToken(payload) {
		return jsonwebtoken.sign(payload, SECRET, {expiresInMinutes: EXPIRE_IN_MINUTES});
	},
	/**
	 * this method ensures, that the request is authenticated
	 * @param  {Object=}  err  [description]
	 * @param  {Object}   req  [description]
	 * @param  {Object}   res  [description]
	 * @param  {Function} next [description]
	 */
	isAuth(err, req, res, next) {
		// if err is set by express-jwt
		if (err.name === 'UnauthorizedError') {
			return next({responseCode: 401, msg: 'invalid authentication'});
		} else {
			// is user is not created by jwt middleware
			if (!req.user) {
				return next({responseCode: 401, msg: 'no authentication'});
			} else {
				return next();
			}
		}
	}
};

export default Auth;