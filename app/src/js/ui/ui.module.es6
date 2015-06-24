'use strict';

import './modal/ui.modal.module.es6';
import './rdwidget/ui.rdwidget.module.es6';
import './widget/ui.widget.module.es6';

import MasterCtrl from './ui.master.ctrl.es6';
import LarchLoading from './ui.loading.drtv.es6';

angular.module('larch.ui', [
	'larch.ui.modal',
	'larch.ui.rdwidget',
	'larch.ui.widget'
	])
	.controller('MasterCtrl', MasterCtrl)
	.directive('larchLoading', LarchLoading)
	;