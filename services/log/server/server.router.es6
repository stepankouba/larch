/**
 * @file Server routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
'use strict';

let lib = require('../../lib/lib.server.es6');
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
				path: '/log/message',
				httpMethod: 'POST',
				middleware: [api.logMessage]
			}
		]);
	}// function
};
