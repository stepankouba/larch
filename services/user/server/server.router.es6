/**
 * @file Server routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */

import api from './server.api.es6';

export default [
	{
		path: '/user/current',
		httpMethod: 'GET',
		requiresAuth: true,
		middleware: [api.getCurrent]
	},
	{
		path: '/user/login',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.login]
	},
	{
		path: '/user/current/logout',
		httpMethod: 'GET',
		requiresAuth: true,
		middleware: [api.logout]
	},
	{
		path: '/user/confirm',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.confirm]
	},
	{
		path: '/user/:username',
		httpMethod: 'PUT',
		requiresAuth: true,
		middleware: [api.update]
	},
	{
		path: '/user/register/',
		httpMethod: 'POST',
		requiresAuth: false,
		middleware: [api.signin]
	},
	{
		path: '/user/:user/auth/:name',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.authSource]
	},
	{
		path: '/user/:user/auth/:name/callback',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.authSourceCallback]
	}
];