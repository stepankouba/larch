'use strict';

import LModal from '../ui/modal/modal.class.es6';

let Ctrl = function ($scope, $modalInstance, ...params) {
	// pass parameters to $scope values
	LModal.passArgsToCtrl.call(Ctrl, $scope, params);

	$scope.ok = function () {
		$modalInstance.close($scope.userParams);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel - no action');
	};
}
Ctrl.$inject = ['$scope', '$modalInstance'];

export default class LWidgetModal extends LModal {
	constructor($injector, widget) {
		let config = {
			templateUrl: 'templates/widget.modal.html',
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