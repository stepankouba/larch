'use strict';

import larchWidget from './ui.widget.drtv.es6';
import WidgetFctr from './ui.widget.fctr.es6';
import LWidgetModal from './ui.widget.modal.class.es6';

angular.module('larch.ui.widget', ['larch.ui.modal'])
	.directive('larchWidget', larchWidget)
	.factory('WidgetFctr', WidgetFctr)
	.factory('LWidgetModal', LWidgetModal)
	;