/**
 * Widget Directive
 */
'use strict';

let larchDashboardDrtv = function ($log) {
	let log = $log.getLogger('DashboardDrtv');

	class larchDashboardCtrl {
		constructor($scope, $element) {
			log.debug('controller');
			this.element = angular.element($element.children()[0]);
			
			this.showGrid = false;
			// 
			this.toggleGrid = function() {
				this.showGrid = !this.showGrid;

				this.element.toggleClass('visible-grid');
				$scope.$broadcast('grid', this.showGrid);
			}
		}
	}
	larchDashboardCtrl.$inject = ['$scope', '$element'];

	let directive = {
		requires: '^larchDrag',
		scope: {},
		transclude: true,
		templateUrl: 'templates/dash/dashboard.drtv.html',
		controllerAs: 'ctrl',
		bindToController: true,
		restrict: 'E',
		link: function larchDashboardDrtvLink($scope, element){
			$scope.widgets = [
				{id: 1, name: 'test1', width: 200, height: 100, x: 0, y:0},
				/*{id: 2, name: 'test2', width: 100, height: 100, x: 200, y:0},
				{id: 3, name: 'test3', width: 200, height: 100, x: 200, y:100}*/
			];
		},
		controller: larchDashboardCtrl
	};

	return directive;
};
larchDashboardDrtv.$inject = ['$log'];

export default larchDashboardDrtv;