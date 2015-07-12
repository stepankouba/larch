'use strict';

let RestErrorSrvc = function($log) {
	this.success = function() {
		return function(result) {
			return result.data;
		};
	};

	this.error = function(moduleName) {
		return function(err) {
			let log = $log.getLogger(moduleName);
			log.error(err);
		};
	};
};
RestErrorSrvc.$inject = ['$log'];

export default RestErrorSrvc;