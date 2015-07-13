'use strict';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.widgets.port + '/widgets/';

let WidgetSrvc = function($http, RestErrorSrvc) {
	
	this.getAll = function(userId) {
		return $http.get(url + 'all/' + userId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('WidgetSrvc'));
	};
	
	this.getById = function(widgetId) {
		return $http.get(url + widgetId)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('WidgetSrvc'));
	};
	
}
WidgetSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default WidgetSrvc;