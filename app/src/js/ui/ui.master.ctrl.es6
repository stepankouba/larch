/**
 * Master Controller
 */
'use strict';

class MasterCtrl {
	constructor($scope, $cookieStore, $log, LarchBoardSrvc) {
		this.$log = $log.getLogger('MasterCtrl');
		this.LarchBoard = LarchBoardSrvc;

		//this.dashboards = null;

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
MasterCtrl.$inject = ['$scope', '$cookieStore', '$log', 'LarchBoardSrvc'];

export default MasterCtrl;