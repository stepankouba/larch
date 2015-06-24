'use strict';

import FilesSrvc from './files.srvc.es6';

angular.module('larch.files', [])
	.service('FilesSrvc', FilesSrvc)
	;