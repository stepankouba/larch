'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

import { AJAXHelper } from '../common/common.lib.es6';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.dash.port + '/dash/';

let DashSrvc = function($http) {
	this.getAll = function(userId) {
		return $http.get(url + 'all/' + userId)
			.then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
	};

	this.getById = function(dashId) {
		return $http.get(url + dashId)
			.then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
	};
}
DashSrvc.$inject = ['$http'];

export default DashSrvc;