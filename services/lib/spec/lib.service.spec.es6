import Service from '../lib.service.es6';

describe('lib.service class unit test', () => {
	let ms;

	describe('testing init method', () => {
		it('should create proper object with default port', () => {
			ms = Service.create('widgets_test');

			expect(ms.name).toBe('widgets_test');
			expect(ms.fullname).toBe('widgets_test.service');
			expect(ms.conf.port).toEqual(9999);
		});

		it('should create proper object', () => {
			ms = Service.create('widgets');

			expect(ms.name).toBe('widgets');
			expect(ms.fullname).toBe('widgets.service');
			expect(ms.conf.port).toEqual(9005);
		});
	});

	describe('testing run method', () => {
		// empty here
	});

	describe('defineRoutes method', () => {
		const apiStack = [];

		const api = function() {
			apiStack.push(1);
		};

		const routes = [
			{
				path: '/user/:id',
				httpMethod: 'GET',
				middleware: [api]
			},
			{
				path: '/user/:id/logout',
				httpMethod: 'GET',
				middleware: [api]
			},
			{
				path: '/user/login',
				httpMethod: 'POST',
				middleware: [api, api]
			},
		];

		beforeEach(() => {
			ms = Service.create('widgets_test');
			ms.init();
			ms.defineRoutes(routes);
		});

		it('should create an array', () => {
			// TODO: proper test of defineRoutes
			// expect(ms.server.get)
		});

	});
});