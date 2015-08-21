import Handlebars from 'handlebars';
import {copyDefinedProps} from '../lib/lib.assign.es6';

// TODO remove c3 dependency from here, so it is part of widget definition
// TODO widget should have it's render function
import c3 from 'c3';

/**
 * Class LWidget defines behaviour of widget plugins
 */
let WidgetClass = function(FileSrvc, DataSrvc, Logger) {
	let Widget = {
		create(plugin, params) {
			let w = Object.create(Widget.prototype);

			Object.keys(plugin).forEach(k => {
				w[k] = plugin[k];
			});

			w.params = params;

			w.templateId = ['../larch_modules', w.name , w.templateUrl].join('/');

			// TODO - paths support need to be added
			// this.loadPaths();
			
			return w;
		},
		prototype: {
			data: undefined,
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
			},

			/**
			 * [loadTemplate description]
			 * @return {[type]} [description]
			 */
			loadTemplate() {
				// TODO a cache here, if several same widgets are loaded
				if (this.templateUrl) {
					return FileSrvc.getFile(this.templateId);
				} else {
					return Promise.resolve(this.template);
				}
			},

			getData() {
				// support multiple requests for data
				if (Array.isArray(this.systemParams)) {
					let _this = this;
					
					return this.systemParams.reduce((prev, item, index, array) => {
						return prev.then(val => {
							// this is due to skipping the first true resolve
							if (typeof(val) ===  'object') {
								// copy sepected object properties into params, to use it in other requests
								copyDefinedProps(val[0], _this.params, array[index - 1].results);
							}

							return DataSrvc.receive(item, _this.params);
						});
					}, Promise.resolve(true));

				} else {
					// get the widget plugin definition file and get data
					return DataSrvc.receive(this.systemParams, this.params);
				}
			},

			append(element){
				this.rootElement = element;
				
				// if there is a custom transofrm data function
				// TODO - make this UDF functionality general
				if (this.udf.transformData) {
					this.data = this.udf.transformData(this.data);
				}

				this.loadTemplate()
					.then(template => {
						if (this.config.useHandleBars) {
							let t = Handlebars.compile(template);
							let html = t({data: this.data, params: this.params});
							element.innerHTML = html;
						} else if (this.config.useC3) {
							// create c3 chart 
							c3.generate(Object.assign(this.displayParams.c3, {bindto: this.rootElement, data: this.data }));
						}
					})
					.catch(err => logger.error(err));
			},

			update(){
				this.append(this.rootElement, this.$compile, this.$scope);
			}
		}
	};

	return Widget;
};
WidgetClass.$injector = ['service.File', 'service.Data','larch.Logger'];

export default {
		name: 'class.Widget',
		type: 'class',
		functor: WidgetClass
	};