/**
 * @file Server routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
'use strict';

let lib = require('../../lib/lib.server.es6');
let auth = require('../../lib/lib.auth.server.es6');
let conf = require('../local.json');
let api = require('./server.api.es6');

module.exports = {


	/**
	 * [createRoutes description]
	 * @param  {[type]} server [description]
	 * @return {[type]}        [description]
	 */
	createRoutes: function croutes(server) {
		lib.createRoutes(server, [
			{
				path: '/user/:id',
				httpMethod: 'GET',
				middleware: [auth.restrict(), auth.isAuth, api.byId]
			},
			{
				path: '/user/:id/logout',
				httpMethod: 'GET',
				middleware: [auth.restrict(), auth.isAuth, api.logout]
			},
			{
				path: '/user/login',
				httpMethod: 'POST',
				middleware: [api.login]
			},
		]);
	}// function
};