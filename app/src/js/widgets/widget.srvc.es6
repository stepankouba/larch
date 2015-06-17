'use strict';

/**
 * Dash API version used
 * @type {String}
 */
const API_VER = '0.1';

let conf = require('../../../../master.json');
let lib = require('../common/lib.helper.es6');
let url = 'http://' + conf.url + ':' + conf.services.widgets.port + '/widgets/';

let WidgetSrvc = function($http) {
    return {
        getAll: function(userId) {
            return $http.get(url + 'all/' + userId)
                .then(lib.handleSuccess(), lib.handleError());
        },
        getById: function(widgetId) {
            return $http.get(url + widgetId)
                .then(lib.handleSuccess(), lib.handleError());
        }
    };
}
WidgetSrvc.$inject = ['$http'];

export default WidgetSrvc;