'use strict';

import Handlebars from 'handlebars';
import { ObjectHelper } from './../common/common.lib.es6'
import c3 from 'c3';
/**
 * Class LWidget defines behaviour of widget plugins
 */
export default class LWidget {
	constructor(plugin, params) {
		Object.keys(plugin).forEach(k => {
			this[k] = plugin[k];
		});

		this.params = params;

		if (!this.template && !this.templateUrl && !this.config.useC3) {
			throw new Error('LWidget: template not specified');
		}

		this.templateId = ['../larch_modules', this.name , this.templateUrl].join('/');

		this.loadPaths();
	}

	/**
	 * load all necessary external modules required by the plugin
	 */
	loadPaths() {
		let p = Object.keys(this.paths);

		// TODO check already loaded files
		// TODO a cache here
		p.forEach(item => {
			let path = this.paths[item];
			let fileref = document.createElement('script');

        	fileref.setAttribute('type','text/javascript');
        	fileref.setAttribute('src', path);

        	document.getElementsByTagName('head')[0].appendChild(fileref);
		});
	}

	loadTemplate() {
		// FilesSrvc injection
		let FilesSrvc = angular.element(document.body).injector().get('FilesSrvc');

		// TODO a cache here, if several same widgets are loaded
		if (this.templateUrl) {
			return FilesSrvc.getFile(this.templateId);
		} else {
			return Promise.resolve(this.template);
		}
	}

	create(element, $compile = null, $scope = null){
		this.rootElement = element;
		this.$compile = $compile;
		this.$scope = $scope;

		// if there is a custom transofmr data function
		if (this.udf.transformData) {
			$scope.data = this.udf.transformData($scope.data);
		}

		this.loadTemplate()
			.then(template => {
				if (this.config.useInnerFramework) {
					element.append($compile(template)($scope));

				    if(this.controller) {
				    	this.controller($scope);
				    }
				} else if (this.config.useHandleBars) {
					let t = Handlebars.compile(template);
					let html = t({data: $scope.data, params: this.params});
					element.append(html);
				} else if (this.config.useC3) {
					
					c3.generate(Object.assign(this.displayParams.c3, {bindto: element[0], data: $scope.data }));
				}
			})
			.catch(err => {
				//throw new Error(err);
				console.log(err);
			});
	}

	update(){
		this.create(this.rootElement, this.$compile, this.$scope);
	}

	getData() {
		let DataSrvc = angular.element(document.body).injector().get('DataSrvc');

		if (Array.isArray(this.systemParams)) {
			let _this = this;
			
			return this.systemParams.reduce((prev, item, index, array) => {
				return prev.then(val => {
					// this is due to skipping the first true resolve
					if (typeof(val) ===  'object') {
						// copy sepected object properties into params, to use it in other requests
						ObjectHelper.copyDefinedProps(val[0], _this.params, array[index - 1].results);
					}

					return DataSrvc.receive(item, _this.params);
				});
			}, Promise.resolve(true));

		} else {

			// get the widget plugin definition file and get data
			return DataSrvc.receive(this.systemParams, this.params);
		}
	}

	getSettings(){}
	saveSettings(){}
}