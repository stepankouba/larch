export default [
	{
		name: 'user',
		re: /^\/api\/user\//,
		target: 'http://localhost:9003',
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
				path: '/api/user',
				httpMethod: 'POST',
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
				requiresAuth: falsexw,
				middleware: []
			},
			{
				path: '/api/widget',
				httpMethod: 'POST',
				requiresAuth: false,
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
	}
];