/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/dashboard/:id',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getDashboard]
	},
	{
		path: '/dashboards/:user',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getMyDashboards]
	}
];