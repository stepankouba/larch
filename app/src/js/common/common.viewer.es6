import Injector from './common.di.es6';
import Handlebars from './common.handlebars.es6';

const ViewerFn = function(HTTPer, Logger) {
	const logger = Logger.create('larch.Viewer');

	const Viewer = {
		views: new Map(),
		parse() {
			const elems = document.querySelectorAll('[data-view]');

			[].forEach.call(elems, item => {
				const viewId = item.getAttribute('data-view');

				this.processView(item, viewId);
			});
		},
		/**
		 * process a required view
		 * @param  {Node} item   HTML DOM node, where view should be appended
		 * @param  {String|Number} viewId view id
		 */
		processView(item, viewId) {
			return this.getTemplate(viewId)
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
			};
		},

		/**
		 * store all the required properties on View object, so that it can be used in controller in this object
		 * @param  {[type]} item   [description]
		 * @param  {[type]} viewId [description]
		 * @return {[type]}        [description]
		 */
		_storeViewObject(item, viewId) {
			return data => {
				// this if checks, whether the input from getTemplate is object (view is already cached) or string (template was loaded)
				const view = this.views.get(viewId);

				if (typeof data !== 'object') {
					view.template = data;
					view.loaded = true;
					view.element = item;
					view.recompile = this.recompile();
					// save template into views Map
					this.views.set(viewId, view);
				}

				return Promise.resolve(view);
			};
		},

		/**
		 * get view from the cache
		 * @param  {string} viewId view id
		 * @return {Object} view
		 */
		_getView(viewId) {
			let view;

			if (this.views.has(viewId) && (view = this.views.get(viewId)).loaded) {
				return view;
			} else {
				return false;
			}
		},
		/**
		 * run view's controller after the view is part of the DOM
		 * @param  {string} viewId view id
		 * @return {Promise}
		 */
		_runController(viewId) {
			return view => {
				const inj = Injector.create();

				// setting view as this for controller
				inj.invoke(view.controller, view);

				return Promise.resolve(view);
			};
		},
		/**
		 * Compile template by Handlebars
		 * @param  {Object} view
		 * @return {String} compiled html string
		 */
		_compileTemplate(view) {
			// TODO: remove compiling of a template, so that recompile() is invoked on already compiled template (i.e. save time)
			if (!view.compiled) {
				view.compiled = Handlebars.compile(view.template);
			}

			return view.compiled(view.scope);
		},
		/**
		 * append a template to the DOM
		 * @return {Promise}
		 */
		_appendTemplate() {
			// need arrow function here to keep this pointing at Viewer
			return view => {
				logger.log(`appending ${view.id}`);
				view.element.innerHTML = this._compileTemplate(view);

				this._addEventListeners(view);

				return Promise.resolve(view);
			};
		},
		/**
		 * add required event listeners, which are defined within the template by data-on-* attribtues
		 * @param {Object} view
		 */
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
				/*eslint no-eval:0*/
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
			const template = this._getView(viewId);

			// check cache
			if (template) {
				return Promise.resolve(template);
			} else {
				const view = this.views.get(viewId);
				// TODO: this is wrong URL!!!!
				const url = `${window.location.origin}/build/templates/${view.templateUrl}`;

				return HTTPer.get(url)
					.then(data => Promise.resolve(data));
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