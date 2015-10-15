/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/source/:name',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getSource]
	},
	{
		path: '/sources',
		httpMethod: 'GET',
		requiresAuth: true,
		middleware: [api.getAllSources]
	}
];