'use strict';

/**
 * [DashboardCtrl description]
 * @param {[type]} $scope   [description]
 * @param {[type]} DashSrvc [description]
 */
class DashboardCtrl {
	constructor($stateParams, $log, LarchBoardSrvc) {
		this.LarchBoard = LarchBoardSrvc;
		let log = $log.getLogger('DashboardCtrl');

		this.LarchBoard
			.getById($stateParams.dashId)
			.then(() => {
				//this.rows = this.LarchBoard.getCurrentRows();
				this.widgets = this.LarchBoard.getCurrentWidgets();
			})
			.catch((err) => {
				log.debug(err);
			});

	}
}
DashboardCtrl.$inject = ['$stateParams', '$log','LarchBoardSrvc'];

export default DashboardCtrl;