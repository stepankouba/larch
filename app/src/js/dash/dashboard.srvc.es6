'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.dash.port + '/dash/';

let DashSrvc = function($http, RestErrorSrvc) {
	this.getAll = function(userId) {
		return $http.get(url + 'all/' + userId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('DashSrvc'));
	};

	this.getById = function(dashId) {
		return $http.get(url + dashId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('DashSrvc'));
	};
}
DashSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default DashSrvc;