/**
 * Widget Directive
 */
'use strict';

let larchDashboardDrtv = function ($log) {
	let log = $log.getLogger('DashboardDrtv');

	class larchDashboardCtrl {
		constructor($scope, $element) {
			
			this.element = angular.element($element.parent()[0]);//angular.element($element.children()[0]);
			
			this.showGrid = false;
			
			this.toggleGrid = function() {
				this.showGrid = !this.showGrid;

				this.element.toggleClass('visible-grid');
				$scope.$broadcast('grid', this.showGrid);
			}
		}
	}
	larchDashboardCtrl.$inject = ['$scope', '$element'];

	let directive = {
		scope: {
			widgets: '='
		},
		transclude: true,
		replace: true,
		templateUrl: 'templates/dash/dashboard.drtv.html',
		controllerAs: 'ctrl',
		bindToController: true,
		restrict: 'E',
		link: function larchDashboardDrtvLink($scope, element){
			
		},
		controller: larchDashboardCtrl
	};

	return directive;
};
larchDashboardDrtv.$inject = ['$log'];

export default larchDashboardDrtv;