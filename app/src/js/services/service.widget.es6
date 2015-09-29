const WidgetSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Widget');

	const srvc = {
		getById(id) {
			logger.log(`requesting widget data for id ${id}`);
			return HTTPer.get(`https://localhost:9101/api/widget/${id}`, {json: true});
		}
	};

	return srvc;
};
WidgetSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.Widget',
	type: 'singleton',
	functor: WidgetSrvc
};