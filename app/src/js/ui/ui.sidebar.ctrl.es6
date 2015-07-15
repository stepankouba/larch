/**
 * Master Controller
 */
'use strict';

class SidebarCtrl {
	constructor($scope, $cookies, $log, LarchBoardSrvc) {
		this.$log = $log.getLogger('SidebarCtrl');
		this.LarchBoard = LarchBoardSrvc;

		this.getDashboards();
	}

	getDashboards() {
		this.LarchBoard
			.getAll(1)
			.catch((err) => {
				this.$log.error(err);
			});
	}
}
SidebarCtrl.$inject = ['$scope', '$cookies', '$log', 'LarchBoardSrvc'];

export default SidebarCtrl;