/**
 * Widget Directive
 */
'use strict';

export function widget() {
    let directive = {
        transclude: true,
        template: '<div class="widget" ng-transclude></div>',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};

export function header() {
    let directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row larch-header-row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-2" ng-transclude></div></div></div>',
        restrict: 'E'
    };

    return directive;
};

export function body() {
    let directive = {
        requires: '^rdWidget',
        scope: {
            //loading: '@?',
            classes: '@?',
            id: '@'
        },
        transclude: true,
        template: '<div class="widget-body" ng-class="classes"><div class="widget-content" id="widget{{id}}" ng-transclude></div></div>',
        restrict: 'E'
    };

    return directive;
};

export function footer() {
    let directive = {
        requires: '^rdWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};

export function title() {
    let directive = {
        requires: '^rdWidget',
        scope: {
            title: '@',
            icon: '@'
        },
        transclude: true,
        template: '<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};