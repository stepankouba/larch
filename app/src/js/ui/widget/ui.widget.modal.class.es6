'use strict';

import LUIModal from '../modal/ui.modal.class.es6'; 

let Ctrl = function ($scope, $modalInstance, ...params) {
	// pass parameters to $scope values
	LUIModal.prototype.passArgsToCtrl.call(Ctrl, $scope, params);

	$scope.ok = function () {
		$modalInstance.close($scope.userParams);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel - no action');
	};
}
Ctrl.$inject = ['$scope', '$modalInstance'];

export default class LWidgetModal extends LUIModal {
	constructor($injector, widget) {
		let config = {
			templateUrl: 'templates/widget/widget.modal.html',
			size: widget.modalParams.size,
		};

		super($injector, config);

		this.setCtrl(Ctrl);
		// pass system and user settings into modal
		this.setResolve({
			userParams: () => Object.assign({}, widget.params),
			typeParams: () => Object.assign({}, widget.typeParams)
		});
	}
}