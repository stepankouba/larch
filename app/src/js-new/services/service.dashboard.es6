/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../master.app.json');

let url = 'http://' + conf.url + ':' + conf.services.dash.port + '/dash/';

let DashSrvc = function(HTTPer, Logger) {
	let logger = Logger.create('service.Dashboard');

	let srvc = {
		getAll(userId) {
			return HTTPer.get(url + 'all/' + userId, {json: true});
		},
		getById(dashId) {
			return HTTPer.get(url + dashId, {json: true});
		}
	};

	return srvc;
}
DashSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
		name: 'service.Dashboard',
		type: 'singleton',
		functor: DashSrvc
	};