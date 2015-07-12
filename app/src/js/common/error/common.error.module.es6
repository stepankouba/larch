'use strict';

import Decorator from './common.error.dcrtr.es6';
import RestErrorSrvc from './common.error.rest.srvc.es6';

let error = angular.module('larch.common.error', []);

error.config(Decorator)
	.service('RestErrorSrvc', RestErrorSrvc);
