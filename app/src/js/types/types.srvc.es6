'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.types.port + '/types/';

let TypesSrvc = function($http, RestErrorSrvc) {
	
	this.getAll = function(userId) {
		return $http.get(url + 'all/' + userId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('TypesSrvc'));
	};

	this.getById = function(widgetId) {
		return $http.get(url + widgetId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('TypesSrvc'));
	};
	
}
TypesSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default TypesSrvc;