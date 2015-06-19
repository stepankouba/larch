'use strict';

export default class LModal {
	constructor($injector, config) {
		let defaultConf = {
			animation: true
		};

		this.injector = $injector;
		this.conf = Object.assign(defaultConf, config);
	}

	open() {
		let $modal = this.injector.get('$modal');
		this.instance = $modal.open(this.conf);
	}

	setCtrl(fn) {
		this.conf.controller = fn;

		// save original $inject length, because, this will be modified later with setResolve
		fn.$injectOrigLength = fn.$inject.length;
	}

	setResolve(obj) {
		if (obj) {
			this.conf.resolve = obj;

			// if there are any resolve, then Ctr.inject has to be updated
			Object.keys(obj).forEach(k => {
				this.conf.controller.$inject.push(k);
			});
			
		}
	}

	/**
	 * This method ensures that parameters passed by resolve configuration object are properly passed to $scope.
	 * This method is called as static (i.e. LModal.prototype.passArgsToCtrl.call(controller, scope, params))
	 * 
	 * @param  {Object} $scope scope, that should be modified
	 * @param  {Array} params values
	 */
	passArgsToCtrl($scope, params) {
		// save original length $inject
		let origParamsLength = this.$injectOrigLength;

		params.forEach((val, index) => {
			let i = index + origParamsLength;
			let argName = this.$inject[i]; 

			$scope[argName] = val;
		})
	}
};