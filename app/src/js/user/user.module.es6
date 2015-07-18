'use strict';

import UserSrvc from './user.srvc.es6';
import LarchUser from './user.larchuser.srvc.es6';
import userRun from './user.run.es6'; 

angular.module('larch.user', ['larch.common.error'])
	.service('UserSrvc', UserSrvc)
	.service('LarchUser', LarchUser)
	.run(userRun)
	;