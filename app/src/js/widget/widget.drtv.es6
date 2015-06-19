/**
 * Widget Directive
 */
'use strict';

import LWidget from './lwidget.class.es6';
import LWidgetModal from '../modal/widget.modal.class.es6';

let larchWidget = function ($compile, $injector) {
    let WidgetSrvc = $injector.get('WidgetSrvc');
    let TypesSrvc = $injector.get('TypesSrvc');
    let DataSrvc = $injector.get('DataSrvc');
    let FilesSrvc = $injector.get('FilesSrvc');

    let directive = {
        requires: 'rdWidget',
        scope: {
            id: '@'
        },
        transclude: true,
        templateUrl: 'templates/widget.html',
        restrict: 'E',
        link: function($scope, element){
            let userParams;

            WidgetSrvc.getById($scope.id)
                .then(data => {
                    // get widget settings
                    userParams = data.params;
                    
                    return FilesSrvc.getFile('./../larch_modules/' + data.type + '/index.js');
                })
                .then(file => {
                    // get the definition
                    let w = eval(file);

                    // create new widget with proper parameters set
                    $scope.widget = new LWidget(w, userParams);

                    return $scope.widget.getData();
                })
                .then(data => {
                    let elBody = angular.element(document.querySelector('[id="widget' + $scope.id + '"]'));
                    $scope.data = data;

                    // create plugin
                    $scope.widget.create(elBody, $compile, $scope);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        controller: function($scope) {
            $scope.openModal = function() {
                let m = new LWidgetModal($injector, $scope.widget);

                m.open();

                m.instance
                    .result
                    .then(value => {
                        $scope.widget.params = value;

                        // set null to display loader
                        $scope.data = null;
                        return $scope.widget.getData();
                    })
                    .then(data => {
                        $scope.data = data;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            };
        }
    };
    directive.$inject = ['$compile', '$injector'];

    return directive;
};

export default larchWidget;