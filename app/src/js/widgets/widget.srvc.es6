'use strict';

import { AJAXHelper } from '../common/common.lib.es6';

let conf = require('../../../../master.json');

let url = 'http://' + conf.url + ':' + conf.services.widgets.port + '/widgets/';

let WidgetSrvc = function($http) {
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
WidgetSrvc.$inject = ['$http'];

export default WidgetSrvc;