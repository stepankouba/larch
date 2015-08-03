'use strict';

let conf = require('../../master.app.json');

let FilesSrvc = function($http, RestErrorSrvc) {
	
	this.getFile = function(path) {
		return $http.get(path)
			.then(RestErrorSrvc.success(), RestErrorSrvc.error('FilesSrvc'));
	};
}
FilesSrvc.$inject = ['$http', 'RestErrorSrvc'];

export default FilesSrvc;