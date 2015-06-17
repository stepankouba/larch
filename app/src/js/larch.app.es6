'use strict';

import angular from 'angular';
import 'angular-cookies';
import 'angular-route';
import 'angular-bootstrap';
import 'babel/polyfill'; //require('babel/polyfill');

// classes

import Router from './larch.routes.es6';

import Loading from './common/loading.drtv.es6';
import MasterCtrl from './common/master.ctrl.es6';

import DashSrvc from './dash/dash.srvc.es6';
import DashboardCtrl from './dash/dashboard.ctrl.es6'

import WidgetSrvc from './widgets/widget.srvc.es6';
import * as rdWidget from './widgets/rdwidget.drtv.es6';
import larchWidget from './widgets/widget.drtv.es6';

import TypesSrvc from './types/types.srvc.es6';

import DataSrvc from './data/data.srvc.es6';

import FilesSrvc from './files/files.srvc.es6';

angular
	.module('larch', ['ui.bootstrap', 'ngRoute', 'ngCookies'])
	.config(Router)
	.controller('MasterCtrl', MasterCtrl)
	.controller('DashboardCtrl', DashboardCtrl)
	.directive('rdLoading', Loading)
	.directive('rdWidget', rdWidget.widget)
	.directive('rdWidgetHeader', rdWidget.header)
	.directive('rdWidgetBody', rdWidget.body)
	.directive('rdWidgetFooter', rdWidget.footer)
	.directive('rdWidgetTitle', rdWidget.title)
	.directive('larchWidget', larchWidget)
	.service('DashSrvc', DashSrvc)
	.service('WidgetSrvc', WidgetSrvc)
	.service('TypesSrvc', TypesSrvc)
	.service('DataSrvc', DataSrvc)
	.service('FilesSrvc', FilesSrvc)
	;


