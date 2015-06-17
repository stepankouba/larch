'use strict';

let conf = require('../../../../master.json');
let lib = require('../common/lib.helper.es6');

let FilesSrvc = function($http) {
    return {
		getFile: function(path) {


            return $http.get(path)
                .then(lib.handleSuccess(), lib.handleError());
        }
    };
}
FilesSrvc.$inject = ['$http'];

export default FilesSrvc;