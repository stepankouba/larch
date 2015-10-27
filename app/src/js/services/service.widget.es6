const WidgetSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Widget');

	const srvc = {
		getById(id) {
			logger.log(`requesting widget definition for id ${id}`);
			return HTTPer.get(`https://localhost:9101/api/widget/${id}`, {json: true});
		},
		getByText(text) {
			return HTTPer.get(`https://localhost:9101/api/widgets?phrase=${text}`, {json: true});
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