'use strict';
let jsonwebtoken = require('jsonwebtoken');
let jwt = require('express-jwt');

const SECRET = 'sleeeeppppppiiiiiinnnnnngggggg';

/**
 * this method creates middleware for restricting a path
 * @return {Function} middleware by express-jwt
 */
let larchRestrict = function() {
	return jwt({secret: SECRET});
};

/**
 * this method ensures, that the request is authenticated
 * @param  {Object=}  err  [description]
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
let larchIsAuth = function(err, req, res, next) {
	// if err is set by express-jwt
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('invalid token sent');
	} else {
		// is user is not created by jwt middleware
		if (!req.user) {
			res.status(401).send('request is not authenticated');
		} else {
			next();
		}
	} 
};

let larchToken = function(payload) {
	return jsonwebtoken.sign(payload, SECRET);
};

module.exports = {
	SECRET: SECRET,
	isAuth: larchIsAuth,
	createToken: larchToken,
	restrict: larchRestrict
};