'use strict';

let conf = require('../../master.app.json');

let url = `http://${conf.url}:${conf.services.user.port}/`;

let UserSrvc = function($http, RestErrorSrvc) {
	this.login = function(username, password) {
		return $http.post(`${url}user/login`, {username: username, password: password})
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('UserSrvc'));
	};

	this.getById = function(id) {
		return $http.get(`${url}user/${id}`)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('UserSrvc'));
	};

	this.logout = function(id) {
		return $http.get(`${url}user/${id}/logout`)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('UserSrvc'));
	}
}
UserSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default UserSrvc;