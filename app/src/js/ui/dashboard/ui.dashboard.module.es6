'use strict';

import larchDashboardDrtv from './ui.dashboard.drtv.es6';
import larchDragDrop from './ui.dashboard.dragdrop.drtv.es6';


angular.module('larch.ui.dashboard', [])
	.directive('larchDashboard', larchDashboardDrtv)
	.directive('larchDrag', larchDragDrop.drag)
	;