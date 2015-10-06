/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/data/:widgetId',
		httpMethod: 'POST',
		requiresAuth: true,
		middleware: [api.getData]
	}
];