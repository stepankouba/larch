'use strict';

function Config($httpProvider) {
	//$httpProvider.defaults.withCredentials = true;
	$httpProvider.interceptors.push('AuthIntrcptr');
}
Config.$inject = ['$httpProvider'];

export default Config;