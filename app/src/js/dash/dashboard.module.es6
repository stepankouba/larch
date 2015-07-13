'use strict';

import DashSrvc from './dashboard.srvc.es6';
import DashboardCtrl from './dashboard.ctrl.es6';
import LarchBoardSrvc from './dashboard.board.srvc.es6';

angular.module('larch.dashboard', ['larch.common.error'])
	.service('DashSrvc', DashSrvc)
	.service('LarchBoardSrvc', LarchBoardSrvc)
	.controller('DashboardCtrl', DashboardCtrl)
	;