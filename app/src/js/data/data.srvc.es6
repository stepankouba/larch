'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../master.app.json');

let DataSrvc = function($http, RestErrorSrvc) {
	
	this.receive = function(systemParams, userParams) {
		let method = systemParams.method || 'get';

		return this[method](systemParams, userParams);
	};

	this.get = function(systemParams, userParams) {
		let url = systemParams.port ? [systemParams.url, systemParams.port].join(':') : systemParams.url;

		// replace {param} strings in URL
		let api = systemParams.api.replace(/{(\w+)}/g, ($0, $1) => userParams[$1]);

		return $http.get(url + api)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('DataSrvc'));
	};
}
DataSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default DataSrvc;