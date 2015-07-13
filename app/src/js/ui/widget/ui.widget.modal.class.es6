'use strict';

let LWidgetModal = function($injector, LUIModal) {
	let Ctrl = function ($scope, $modalInstance, ...params) {
		// pass parameters to $scope values
		LUIModal.passArgsToCtrl.call(Ctrl, $scope, params);

		$scope.ok = function () {
			$modalInstance.close($scope.userParams);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel - no action');
		};
	}
	Ctrl.$inject = ['$scope', '$modalInstance'];

	class LWidgetModalClass extends LUIModal {
		constructor(widget) {
			let config = {
				templateUrl: 'templates/widget/widget.modal.html',
				size: widget.modalParams.size,
			};

			super(config);

			this.setCtrl(Ctrl);
			// pass system and user settings into modal
			this.setResolve({
				userParams: () => Object.assign({}, widget.params),
				typeParams: () => Object.assign({}, widget.typeParams)
			});
		}
	}

	return LWidgetModalClass
};
LWidgetModal.$inject = ['$injector', 'LUIModal'];

export default LWidgetModal;