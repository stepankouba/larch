/**
 * Master Controller
 */
'use strict';

class HeaderCtrl {
	constructor($scope, $cookies, $log) {
		this.log = $log.getLogger('HeaderCtrl');
		
		this.log.debug('test');
	}
}
HeaderCtrl.$inject = ['$scope', '$cookies', '$log',];

export default HeaderCtrl;