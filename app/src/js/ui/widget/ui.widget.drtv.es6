/**
 * Widget Directive
 */
'use strict';

import LWidget from './ui.widget.class.es6';
import LWidgetModal from './ui.widget.modal.class.es6';

let larchWidget = function ($compile, $log, WidgetFctr) {
	let log = $log.getLogger('WidgetDrtv');

	let directive = {
		requires: 'rdWidget',
		scope: {
			id: '@'
		},
		transclude: true,
		templateUrl: 'templates/widget/widget.html',
		restrict: 'E',
		link: function($scope, element){

			WidgetFctr($scope.id)
				.then(widget => {
					$scope.widget = widget;

					return $scope.widget.getData();
				})
				.then(data => {
					let elBody = angular.element(document.querySelector('[id="widget' + $scope.id + '"]'));
					$scope.data = data;

					// create plugin
					$scope.widget.create(elBody, $compile, $scope);
				})
				.catch(err => {
					log.error(err);
				});
		},
		controller: function($scope) {
			$scope.openModal = function() {
				let m = new LWidgetModal($injector, $scope.widget);

				m.open()
					.then(value => {
						$scope.widget.params = value;

						// set null to display loader
						$scope.data = null;
						return $scope.widget.getData();
					})
					.then(data => {
						$scope.data = data;
					})
					.catch(err => {
						console.log(err);
					});
			};
		}
	};
	directive.$inject = ['$compile', '$log', 'WidgetFctr'];

	return directive;
};

export default larchWidget;