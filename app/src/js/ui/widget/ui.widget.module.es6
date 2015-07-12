'use strict';

import larchWidget from './ui.widget.drtv.es6';
import WidgetFctr from './ui.widget.fctr.es6';

angular.module('larch.ui.widget', [])
	.directive('larchWidget', larchWidget)
	.factory('WidgetFctr', WidgetFctr)
	;