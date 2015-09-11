/**
 * @file Server routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */

import api from './server.api.es6';

export default [
	// {
	// 	path: '/user/:id',
	// 	httpMethod: 'GET',
	// 	middleware: [auth.restrict(), auth.isAuth, api.byId]
	// },
	// {
	// 	path: '/user/:id/logout',
	// 	httpMethod: 'GET',
	// 	middleware: [auth.restrict(), auth.isAuth, api.logout]
	// },
	{
		path: '/user/login',
		httpMethod: 'GET',
		middleware: [api.login]
	}
];