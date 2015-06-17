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
				path: '/redmine/issue/:id/log',
				httpMethod: 'GET',
				middleware: [api.issueLog]
			},
			{
				// TODO can not be only month here - has to take also year into account
				path: '/redmine/issues/:user/log/:month',
				httpMethod: 'GET',
				middleware: [api.issuesUserLog]
			},
			{
				path: '/redmine/spent/all',
				httpMethod: 'GET',
				middleware: [api.allSpent]
			},
			{
				path: '/redmine/spent/lastweek',
				httpMethod: 'GET',
				middleware: [api.lastWeekSpent]
			},
			{
				path: '/redmine/version/:projects/:month',
				httpMethod: 'GET',
				middleware: [api.monthVersion]
			}
		]);
	}// function
};