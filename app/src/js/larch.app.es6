'use strict';

import angular from 'angular';
import 'angular-cookies';
import 'angular-ui-router';
import 'angular-bootstrap';
import 'babel/polyfill';

import './common/error/common.error.module.es6';
import './ui/ui.module.es6';
import './dash/dashboard.module.es6';
import './data/data.module.es6';
import './files/files.module.es6';
import './types/types.module.es6';
import './widgets/widgets.module.es6';
import './user/user.module.es6';

// classes
import Router from './larch.routes.es6';
import Config from './larch.config.es6';
import AuthIntrcptr from './larch.auth.es6';

 
angular
	.module('larch', ['ui.bootstrap', 'ui.router', 'ngCookies',
		'larch.common.error',
		'larch.ui',
		'larch.dashboard',
		'larch.data',
		'larch.files',
		'larch.types',
		'larch.widgets',
		'larch.user'
		])
	.factory('AuthIntrcptr', AuthIntrcptr)
	.config(Router)
	.config(Config)
	;


