'use strict';

import * as rdWidget from './ui.rdwidget.drtv.es6';

angular.module('larch.ui.rdwidget', [])
	.directive('rdWidget', rdWidget.widget)
	.directive('rdWidgetHeader', rdWidget.header)
	.directive('rdWidgetBody', rdWidget.body)
	.directive('rdWidgetFooter', rdWidget.footer)
	.directive('rdWidgetTitle', rdWidget.title)
	;