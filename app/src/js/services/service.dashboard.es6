const DashSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Dashboard');

	const srvc = {
		getAll(user) {
			logger.log(`request to /api/dashboards/${user} sent`);
			return HTTPer.get(`https://localhost:9101/api/dashboards/${user}`, {json: true});
		},
		getById(id) {
			logger.log(`request to /api/dashboard/{$id} sent`);
			return HTTPer.get(`https://localhost:9101/api/dashboard/${id}`, {json: true});
		}
	};

	return srvc;
};
DashSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.Dashboard',
	type: 'singleton',
	functor: DashSrvc
};