const API_VER = '0.1';

let conf = require('../../master.app.json');

let url = 'http://' + conf.url + ':' + conf.services.widgets.port + '/widgets/';

let WidgetSrvc = function(HTTPer, Logger) {
	let logger = Logger.create('service.Widget');

	let srvc = {
		getAll(userId) {
			return HTTPer.get(url + 'all/' + userId, {json: true});
		},
		getById(widgetId) {
			return HTTPer.get(url + widgetId, {json: true});
		}
	};

	return srvc;
}
WidgetSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
		name: 'service.Widget',
		type: 'singleton',
		functor: WidgetSrvc
	};