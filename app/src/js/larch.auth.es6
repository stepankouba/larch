'use strict';

function AuthIntrcptr($cookies, $log) {
	let log = $log.getLogger('AuthIntrcptr');
	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($cookies.getObject('larch.user')) {
				config.headers.Authorization = 'Bearer ' + $cookies.getObject('larch.user').token;
			}
			return config;
		},
		response: function (response) {
			if (response.status === 401) {
				log.debug('401 problem');
			}

			return response;
		}
	  };
}
AuthIntrcptr.$inject = ['$cookies', '$log'];

export default AuthIntrcptr;