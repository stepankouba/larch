'use strict';

import DashSrvc from './dashboard.srvc.es6';
import DashboardCtrl from './dashboard.ctrl.es6';


angular.module('larch.dashboard', [])
	.service('DashSrvc', DashSrvc)
	.controller('DashboardCtrl', DashboardCtrl)
	;