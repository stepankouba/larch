'use strict';
/**
 * @class LUIModal defines base Modal behaviour
 */
export default class LUIModal {

	/**
	 * define basic configuration and $injector for using $modal
	 * @param  {object} $injector injector from angular
	 * @param  {object} config    configuration of modal window as described here: https://angular-ui.github.io/bootstrap/#/modal
	 */
	constructor($injector, config) {
		let defaultConf = {
			animation: true
		};

		this.injector = $injector;
		this.conf = Object.assign(defaultConf, config);
	}

	/**
	 * opens new modal window
	 */
	open() {
		let $modal = this.injector.get('$modal');
		this.instance = $modal.open(this.conf);
	}

	/**
	 * set controller as provided function. The function must already use $inject attribute
	 * @param {Function} fn Cotnroller function
	 */
	setCtrl(fn) {
		this.conf.controller = fn;

		// save original $inject length, because, this will be modified later with setResolve
		fn.$injectOrigLength = fn.$inject.length;
	}

	/**
	 * setResolve is used to pass data into modal controller and scope. This method adds the resolve variables at the end of the $inject array.
	 * @example
	 * 	let Ctrl = function ($scope, $modalInstance, ...params) {...}
	 * 	Ctrl.$inject = ['$scope', '$modalInstance'];
	 * 
	 * @param {object} obj each attribute is a function returning data, to be used in controller
	 */
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
	 * This method is called as static (i.e. LUIModal.prototype.passArgsToCtrl.call(controller, scope, params))
	 * 
	 * @param  {Object} $scope scope, that should be modified
	 * @param  {Array} params values
	 */
	static passArgsToCtrl($scope, params) {
		// save original length $inject
		let origParamsLength = this.$injectOrigLength;

		params.forEach((val, index) => {
			let i = index + origParamsLength;
			let argName = this.$inject[i]; 

			$scope[argName] = val;
		})
	}
};