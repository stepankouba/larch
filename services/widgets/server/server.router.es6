/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/widgets/all/:userId',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getAll]
	},
	{
		path: '/widgets/:widgetId',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getById]
	}
];