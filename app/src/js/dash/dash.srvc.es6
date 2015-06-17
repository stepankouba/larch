'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');
let lib = require('../common/lib.helper.es6');

let url = 'http://' + conf.url + ':' + conf.services.dash.port + '/dash/';

let DashSrvc = function($http) {
    return {
        getAll: function(userId) {
            return $http.get(url + 'all/' + userId)
                .then(lib.handleSuccess(), lib.handleError());
        },
        getById: function(dashId) {
            return $http.get(url + dashId)
                .then(lib.handleSuccess(), lib.handleError());
        }
    };
}
DashSrvc.$inject = ['$http'];

export default DashSrvc;