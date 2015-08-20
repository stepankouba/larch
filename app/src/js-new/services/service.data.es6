const API_VER = '0.1';

let conf = require('../../master.app.json');

let DataSrvc = function(HTTPer, Logger) {
	let logger = Logger.create('service.Data');

	let srvc = {
		receive(systemParams, userParams) {
			let method = systemParams.method || 'get';

			return this[method](systemParams, userParams);
		},
		get(systemParams, userParams) {
			let url = systemParams.port ? [systemParams.url, systemParams.port].join(':') : systemParams.url;

			// replace {param} strings in URL
			let api = systemParams.api.replace(/{(\w+)}/g, ($0, $1) => userParams[$1]);

			return HTTPer.get(url + api, {json: true});	
		}
	};

	return srvc;
}
DataSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
		name: 'service.Data',
		type: 'singleton',
		functor: DataSrvc
	};