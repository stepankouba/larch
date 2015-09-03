/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/widget/:id',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getById]
	},
	{
		path: '/widget',
		httpMethod: 'POST',
		requiresAuth: false,
		middleware: [api.postWidgetUpload().single('widget'),api.postWidget()]
	},
	{
		path: '/widget/:name/:version/asset/:asset',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getAssetsById]
	},
	{
		path: '/widgets',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getByText]
	}
];