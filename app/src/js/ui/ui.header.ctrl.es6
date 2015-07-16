/**
 * Master Controller
 */
'use strict';

class HeaderCtrl {
	constructor($scope, $cookies, $log, LarchUser) {
		let log = $log.getLogger('HeaderCtrl');
		this.LarchUser = LarchUser;

		this.login = function() {
			// user is logged in
			// if (LarchUser.user) {
			// 	return true;
			// }

			LarchUser.login('test', 'test');
		};

		this.logout = function() {
			LarchUser.logout();
		};

		this.showDetails = function() {

		};
	}
}
HeaderCtrl.$inject = ['$scope', '$cookies', '$log', 'LarchUser'];

export default HeaderCtrl;