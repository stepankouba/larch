'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');
let lib = require('../common/lib.helper.es6');

let DataSrvc = function($http) {
    return {
    	receive: function(systemParams, userParams) {
    		let method = systemParams.method || 'get';

    		return this[method](systemParams, userParams);
    	},

        get: function(systemParams, userParams) {
            let url = systemParams.port ? [systemParams.url, systemParams.port].join(':') : systemParams.url;

            // replace {param} strings in URL
            let api = systemParams.api.replace(/{(\w+)}/g, ($0, $1) => userParams[$1]);

            return $http.get(url + api)
                .then(lib.handleSuccess(), lib.handleError());
        }
    };
}
DataSrvc.$inject = ['$http'];

export default DataSrvc;