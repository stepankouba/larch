import Injector from './common/common.di.es6';
import Logger from './common/common.logger.es6';
import HTTPer from './common/common.httper.es6';
import Viewer from './common/common.viewer.es6';
import Router from './common/common.router.es6';
import Cookies from './common/common.cookies.es6';

let logger;

// TODO: create custom errors objects: https://github.com/angular/angular.js/blob/291d7c467fba51a9cb89cbeee62202d51fe64b09/src/minErr.js
const Larch = {
	create(name = 'larch') {
		const app = Object.create(Larch.prototype);

		app.name = name;

		// some tasks before we init the app
		app._initApp();

		return app;
	},
	prototype: {
		_initApp() {
			// create main injector
			this.Injector = Injector.create();

			// include main deps
			this.Injector.class('larch.Logger', Logger);
			this.Injector.singleton('larch.Cookies', Cookies);
			this.Injector.singleton('larch.HTTPer', HTTPer);
			this.Injector.singleton('larch.Viewer', Viewer);
			this.Injector.singleton('larch.Router', Router);

			this.logger = logger = this.Injector.get('larch.Logger').create(`larch.${this.name}`);
		},

		models(models) {
			models.forEach(obj => this.Injector.singleton(obj.name, obj.model));
		},

		components(components) {
			components.forEach(obj => {
				this.Injector[obj.type](obj.name, obj.functor);
			});
		},

		views(views) {
			const Viewer = this.Injector.get('larch.Viewer');

			views.forEach(view => Viewer.addView(view));
		},

		routes(routeDef = []) {
			const Router = this.Injector.get('larch.Router');

			Router.conf();

			routeDef.forEach(route => Router.add(route));
		},
		services(services) {
			services.forEach(srvc => {
				if (!srvc.type || !srvc.name || !srvc.functor) {
					logger.error(`can not initiate servce ${srvc}`);
				} else {
					this.Injector[srvc.type](srvc.name, srvc.functor);
				}
			});
		},
		/**
		 * init method to be started before app runs
		 * @param  {Function} fn [description]
		 * @return {[type]}      [description]
		 */
		init(fn = undefined) {
			if (fn) {
				return this.Injector.invoke(fn);
			}
		},
		/**
		 * starts the app, if function passed, it will be started right after the Router and Views
		 * @param  {Function} fn run function
		 */
		run(fn = undefined) {
			// initial router and viewer run
			this._runRouter();
			this._runViews();

			if (fn) {
				this.Injector.invoke(fn);
			}
		},
		_runRouter() {
			const Router = this.Injector.get('larch.Router');

			Router.navigateToMain(false);
		},

		_runViews() {
			const Viewer = this.Injector.get('larch.Viewer');

			Viewer.parse();
		}
	}
};

export default Larch;