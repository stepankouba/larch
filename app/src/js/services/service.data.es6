const DataSrvc = function(HTTPer, Logger) {
	const logger = Logger.create('service.Data');

	const srvc = {
		getData(widget, settings, security) {
			logger.log(`request to /api/widget/${widget.id} sent`);

			const postData = {
				widget,
				settings,
				security
			};

			return HTTPer.post(`https://localhost:9101/api/data/${widget.id}`, postData, {json: true});
		},
		getPublicData(dashboardId, widgetId) {
			return HTTPer.get(`https://localhost:9101/api/data/public/${dashboardId}/${widgetId}`, {json: true});
		}
	};

	return srvc;
};
DataSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'service.Data',
	type: 'singleton',
	functor: DataSrvc
};