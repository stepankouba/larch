/**
 * Master Controller
 */
'use strict';

let MasterCtrl = function ($scope, $cookieStore, $routeParams, $log, $filter, DashSrvc) {
	$log = $log.getLogger('MasterCtrl');

	$scope.dashboards = null;

	this.getDashboards = function (){
		DashSrvc.getAll(1)
			.then(data => {
				const home = $filter('filter')(data, {home: true});

				if ($routeParams.dashId === 'home') {
					$scope.dashboardId = home[0].id;
				} else {
					$scope.dashboardId = $routeParams.dashId;
				}

				$scope.dashboards = data;
			});

	};

	// get dashboards
	this.getDashboards();
};
MasterCtrl.$inject = ['$scope', '$cookieStore', '$routeParams', '$log', '$filter', 'DashSrvc'];

export default MasterCtrl;