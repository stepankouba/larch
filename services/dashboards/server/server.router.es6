/**
 * @file Service routes definition
 * @author Stepan Kouba <stepan.kouba.work@gmail.com>
 */
import api from './server.api.es6';

export default [
	{
		path: '/dashboard/:id',
		httpMethod: 'GET',
		requiresAuth: true,
		middleware: [api.getDashboard]
	},
	{
		path: '/dashboard/public/:id',
		httpMethod: 'GET',
		requiresAuth: false,
		middleware: [api.getPublicDashboard]
	},
	{
		path: '/dashboards/:user',
		httpMethod: 'GET',
		requiresAuth: true,
		middleware: [api.getMyDashboards]
	},
	{
		path: '/dashboard/shared',
		httpMethod: 'POST',
		requiresAuth: true,
		middleware: [api.saveFromShared]
	},
	{
		path: '/dashboard/',
		httpMethod: 'POST',
		requiresAuth: true,
		middleware: [api.saveDashboard]
	},
	{
		path: '/dashboard/:id',
		httpMethod: 'DELETE',
		requiresAuth: true,
		middleware: [api.remove]
	},
	{
		path: '/dashboard/:id',
		httpMethod: 'PUT',
		requiresAuth: true,
		middleware: [api.updateDashboard]
	},
	{
		path: '/dashboard/:id/unshare',
		httpMethod: 'PUT',
		requiresAuth: true,
		middleware: [api.removeSharing]
	}
];