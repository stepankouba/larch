'use strict';

import DataSrvc from './data.srvc.es6';

angular.module('larch.data', [])
	.service('DataSrvc', DataSrvc)
	;