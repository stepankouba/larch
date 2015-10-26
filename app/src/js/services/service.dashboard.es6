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
		},
		save(obj) {
			logger.log(`request POST to /api/dashboard/ sent`);
			return HTTPer.post(`https://localhost:9101/api/dashboard/`, obj, {json: true});
		},
		saveFromShared(url) {
			logger.log(`request POST to /api/dashboard/shared sent`);
			return HTTPer.post(`https://localhost:9101/api/dashboard/shared/`, {url}, {json: true});
		},
		remove(id) {
			logger.log(`request DELETE to /api/dashboard/${id} sent`);
			return HTTPer.delete(`https://localhost:9101/api/dashboard/${id}`, {json: true});
		},
		update(id, obj) {
			logger.log(`request PUT to /api/dashboard/ sent`);
			return HTTPer.put(`https://localhost:9101/api/dashboard/${id}`, obj, {json: true});
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