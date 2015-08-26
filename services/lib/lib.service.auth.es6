const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');

const SECRET = 'sleeeeppppppiiiiiinnnnnngggggg';

const Auth = {
	/**
	 * this defines jwt middleware for the secure API's
	 * @type {Function}
	 */
	secure: jwt({secret: SECRET}),
	/**
	 * creates a token if required
	 * @param  {Object} payload anything what should be encrypted into the token
	 * @return {string} token
	 */
	createToken(payload) {
		return jsonwebtoken.sign(payload, SECRET);
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
			return next(new Error('invalid token sent'));
		} else {
			// is user is not created by jwt middleware
			if (!req.user) {
				return next(new Error('request is not authenticated'));
			} else {
				return next();
			}
		}
	}
};

export default Auth;