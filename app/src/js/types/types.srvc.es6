'use strict';

import { AJAXHelper } from '../common/common.lib.es6';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.types.port + '/types/';

let TypesSrvc = function($http) {
    return {
        getAll: function(userId) {
            return $http.get(url + 'all/' + userId)
                .then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
        },
        getById: function(widgetId) {
            return $http.get(url + widgetId)
                .then(AJAXHelper.handleSuccess(), AJAXHelper.handleError());
        }
    };
}
TypesSrvc.$inject = ['$http'];

export default TypesSrvc;