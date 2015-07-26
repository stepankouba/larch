/**
 * Widget Directive
 */
'use strict';

let larchDashboardDrtv = function ($log) {
	let log = $log.getLogger('DashboardDrtv');

	class Ctrl {
		constructor($scope) {
			log.debug('controller');
		}

		toggleGrid() {
			// get element width and height
			let {width, height} = document.querySelector('#larch-dashboard-content').getBoundingClientRect();
			const widgetHeight = 200;
			const widgetWidth = 200;

			let rows = Math.floor(height / widgetHeight);
			let columns = Math.floor(width / widgetWidth);
			this.gridRows = Array.from(new Array(rows), (x, i) => i);
			this.gridColumns = Array.from(new Array(columns), (x,i) => i);

			this.showGrid = !this.showGrid;
		}
	}
	Ctrl.$inject = ['$scope'];

	let directive = {
		// requires: '',
		scope: {},
		transclude: true,
		templateUrl: 'templates/dash/dashboard.drtv.html',
		controllerAs: 'ctrl',
		bindToController: true,
		restrict: 'E',
		link: function($scope, element){
			$scope.widgets = [
				{id: 1, name: 'test1', width: 200, height: 100, x: 0, y:0},
				{id: 2, name: 'test2', width: 100, height: 100, x: 200, y:0},
				{id: 3, name: 'test3', width: 200, height: 100, x: 200, y:100}
			];
			
			$scope.showGrid = false;

			$scope.userGrid = [
				[0, 1],
				[2]
			];

			$scope.getWidget = function(id) {
				return $scope.widgets.filter(item => {
					return id == item.id;
				})[0];
			};

			// $scope.getWidget = function(row, column) {
			// 	let t = $scope.widgets.filter((item) => {
			// 		return item.x == row && item.y == column;
			// 	});

			// 	$scope.cell = t.length ? t[0] : undefined ;
			// }
		},
		controller: Ctrl
	};

	return directive;
};
larchDashboardDrtv.$inject = ['$log'];

export default larchDashboardDrtv;