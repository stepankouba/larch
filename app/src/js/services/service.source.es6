const SourceSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Source');

	const srvc = {
		getAll() {
			return HTTPer.get(`https://localhost:9101/api/sources`, {json: true});
		}
	};

	return srvc;
};
SourceSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.Source',
	type: 'singleton',
	functor: SourceSrvc
};