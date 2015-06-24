'use strict';

import LBoard from './dashboard.board.class.es6';

/**
 * [DashboardCtrl description]
 * @param {[type]} $scope   [description]
 * @param {[type]} DashSrvc [description]
 */
let DashboardCtrl = function ($scope, DashSrvc) {
	DashSrvc.getById($scope.dashboardId)
		.then(data => {
			// get dashboard
			let d = new LBoard(data);

			// get rows num
			$scope.rows = d.getRows();

			// get widgets with width and height set
			$scope.widgets = d.getWidgets();
		});
}; 
DashboardCtrl.$inject = ['$scope', 'DashSrvc'];

export default DashboardCtrl;