import Injector from './common.di.es6';
import Handlebars from './common.handlebars.es6';

let ViewerFn = function(HTTPer, Logger) {
	let logger = Logger.create('larch.Viewer');

	let Viewer = {
		views: new Map(),
		parse() {
			let elems = document.querySelectorAll('[data-view]');

			[].forEach.call(elems, item => {
				let viewId = item.getAttribute('data-view');

				this.processView(item, viewId);
			});
		},

		processView(item, viewId) {

			this.getTemplate(viewId)
				.then(this._storeViewObject(item, viewId))
				.then(this._appendTemplate(item, viewId))
				.then(this._runController(viewId))
				.catch(err => logger.error(err));
		},

		/**
		 * recompile method is called on the view object via this, which is set in _storeViewObject
		 * @return {Function} [description]
		 */
		recompile() {
			return function recompile() {
				Viewer._appendTemplate()(this);
				//this.element.innerHTML = Viewer._compileTemplate(this);
				//logger.log('recompiled', this.scope);
			};
		},

		/**
		 * store all the required properties on View object, so that it can be used in controller in this object
		 * @param  {[type]} item   [description]
		 * @param  {[type]} viewId [description]
		 * @return {[type]}        [description]
		 */
		_storeViewObject(item, viewId) {
			let self = this;
			return (data) => {
				let view = self.views.get(viewId);
					
				view.template = data;
				view.loaded = true;
				view.element = item;
				view.recompile = self.recompile();
				// save template into views Map
				self.views.set(viewId, view);

				return Promise.resolve(view);
			};
		},

		_getView(viewId) {
			let view;

			if (this.views.has(viewId) && (view = this.views.get(viewId)).loaded) {
				return view;
			} else {
				return false;
			}
		},

		_runController(viewId) {
			return (view) => {
				let inj = Injector.create();

				// setting view as this for controller
				inj.invoke(view.controller, view);
				
				//return Promise.resolve(view);
			}
		},

		_compileTemplate(view) {
			// TODO: remove compiling of a template, so that recompile() is invoked on already compiled template (i.e. save time)
			let t = Handlebars.compile(view.template);
			let html = t(view.scope);
			
			return html;
		},

		_appendTemplate() {
			// need arrow function here to keep this pointing at Viewer
			return (view) => {
				logger.log(`appending ${view.id}`);
				view.element.innerHTML = this._compileTemplate(view);

				this._addEventListeners(view);

				return Promise.resolve(view);
			}
		},

		_addEventListeners(view) {
			const onclicks = view.element.querySelectorAll('[data-on-click]');

			[].forEach.call(onclicks, item => {
				// attribute value
				const attr = item.getAttribute('data-on-click');
				// firstly get all attributes, split them by , and then eval them to get proper types
				let attributes = attr.match(/\( *([^)]+?) *\)/i);
				if (attributes === null) {
					attributes = ['', ''];
				}

				attributes = attributes[1].split(/\s*,\s*/g).map(i => eval(i));

				// new ('test', 15,'value') - get first after spliting with (, then teplace any spaces
				const methodName = attr.split('(')[0].trim();

				item.addEventListener('click', e => {
					// call requested method
					view.methods[methodName].apply(view, [e, ...attributes]);
				});
			});
		},

		/**
		 * [getTemplate description]
		 * @param  {[type]} viewId [description]
		 * @return {[type]}            [description]
		 */
		getTemplate(viewId) {
			let template = this._getView(viewId);
			
			if (template) {
				return Promise.resolve(template);
			} else {
				let view = this.views.get(viewId);
				// TODO: this is wrong URL!!!!
				let url = window.location.origin + '/build/templates/' + view.templateUrl;

				return HTTPer.get(url)
					.then(data => {	
						return Promise.resolve(data);
					});
			}
		},

		addView(obj) {
			if (!obj.id || !obj.templateUrl || this.views.has(obj.id)) {
				logger.error(`Can not add view ${obj}`);
				return;
			}

			this.views.set(obj.id, obj);
		}
	};

	return Viewer;
};
ViewerFn.$injector = ['larch.HTTPer', 'larch.Logger'];

export default ViewerFn;