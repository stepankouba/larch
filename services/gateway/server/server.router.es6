export default [
	{
		name: 'user',
		re: /^\/api\/user\//,
		target: 'http://localhost:9104',
		routes: [
			{
				path: '/api/user/current',
				httpMethod: 'GET',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/user/login',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/user/current/logout',
				httpMethod: 'GET',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/user/confirm',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/user/:username',
				httpMethod: 'PUT',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/user/register/',
				httpMethod: 'POST',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/user/auth/:name',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/user/auth/:name/callback',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			}
		]
	},
	{
		name: 'widgets',
		re: /^\/api\/(widget|widgets)\/?/,
		target: 'http://localhost:9105',
		routes: [
			{
				path: '/api/widget/:id',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/widget',
				httpMethod: 'POST',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/widget/:name/:version/asset/:asset',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/widgets',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			}
		]
	},
	{
		name: 'data',
		re: /^\/api\/data\/?/,
		target: 'http://localhost:9106',
		routes: [
			{
				path: '/api/data/:widgetId',
				httpMethod: 'POST',
				requiresAuth: false,
				middleware: []
			}
		]
	},
	{
		name: 'dashboards',
		re: /^\/api\/(dashboard|dashboards)\/?/,
		target: 'http://localhost:9107',
		routes: [
			{
				path: '/api/dashboard/:id',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/dashboard/:id',
				httpMethod: 'DELETE',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/dashboard/:id',
				httpMethod: 'PUT',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/dashboards/:user',
				httpMethod: 'GET',
				requiresAuth: true,
				middleware: []
			},
			{
				path: '/api/dashboard/',
				httpMethod: 'POST',
				requiresAuth: true,
				middleware: []
			}
		]
	},
	{
		name: 'sources',
		re: /^\/api\/(source|sources)\/?/,
		target: 'http://localhost:9108',
		routes: [
			{
				path: '/api/source/:name',
				httpMethod: 'GET',
				requiresAuth: false,
				middleware: []
			},
			{
				path: '/api/sources',
				httpMethod: 'GET',
				requiresAuth: true,
				middleware: []
			}
		]
	},
];