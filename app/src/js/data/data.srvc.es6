'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

import { AJAXHelper } from '../common/common.lib.es6';

let conf = require('../../../../master.json');

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
                .then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
        }
    };
}
DataSrvc.$inject = ['$http'];

export default DataSrvc;