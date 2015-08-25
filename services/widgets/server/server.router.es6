/**
 * @file Server routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */

import api from './server.api.es6';

let lib = require('../../lib/lib.server.es6');
let conf = require('../local.json'); 

export default {

	/**
	 * [createRoutes description]
	 * @param  {[type]} server [description]
	 * @return {[type]}        [description]
	 */
	createRoutes: function croutes(server) {
		lib.createRoutes(server, [
			{
				path: '/widgets/all/:userId',
				httpMethod: 'GET',
				middleware: [api.getAll]
			},
			{
				path: '/widgets/:widgetId',
				httpMethod: 'GET',
				middleware: [api.getById]
			},
		]);
	}// function
};