'use strict';

import './modal/ui.modal.module.es6';
import './rdwidget/ui.rdwidget.module.es6';
import './widget/ui.widget.module.es6';

import SidebarCtrl from './ui.sidebar.ctrl.es6';
import HeaderCtrl from './ui.header.ctrl.es6';
import LarchLoading from './ui.loading.drtv.es6';

angular.module('larch.ui', [
	'larch.ui.modal',
	'larch.ui.rdwidget',
	'larch.ui.widget'
	])
	.controller('SidebarCtrl', SidebarCtrl)
	.controller('HeaderCtrl', HeaderCtrl)
	.directive('larchLoading', LarchLoading)
	;