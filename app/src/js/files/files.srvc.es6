'use strict';

import { AJAXHelper } from '../common/common.lib.es6';

let conf = require('../../../../master.json');

let FilesSrvc = function($http) {
	
	this.getFile = function(path) {
		return $http.get(path)
			.then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
	};
}
FilesSrvc.$inject = ['$http'];

export default FilesSrvc;