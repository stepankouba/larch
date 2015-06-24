/**
 * Master Controller
 */
'use strict';

let MasterCtrl = function ($scope, $cookieStore, $routeParams, $log, DashSrvc) {
	$log = $log.getLogger('MasterCtrl');

	$scope.dashboards = null;

	this.getDashboards = function (){
		$scope.dashboardId = $routeParams.dashId;

		DashSrvc.getAll(1)
			.then(data => {
				$scope.dashboards = data;
			});
	};

	// get dashboards
	this.getDashboards();
};
MasterCtrl.$inject = ['$scope', '$cookieStore', '$routeParams', '$log', 'DashSrvc'];

export default MasterCtrl;