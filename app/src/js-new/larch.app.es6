'use strict';

import Injector from './larch.di.es6';
import Logger from './larch.common.logger.es6';
import HTTPer from './larch.common.httper.es6';
import Viewer from './larch.common.viewer.es6';
import Router from './larch.common.router.es6';

let Larch = {
	createApp(name = 'larch') {
		let app = Object.create(Larch.prototype);

		app.name = name;

		// some tasks before we init the app
		app._initApp();

		//app.Controlor = Controlor.create();
		return app;
	},
	prototype: {
		_initApp() {
			// create app injector
			this.Injector = Injector.create();

			// include main deps
			this.Injector.class('larch.Logger', Logger);
			this.Injector.singleton('larch.HTTPer', HTTPer);
			this.Injector.singleton('larch.Viewer', Viewer);
			this.Injector.singleton('larch.Router', Router);

			// init viewer
			// this._initViewer();
		},
		_initViewer() {
			let Viewer = this.Injector.get('larch.Viewer');

			Viewer.parse();
		},

		routes(routeDef = []) {
			let routesAdd = (Router) => {
				Router.conf();

				routeDef.forEach(route => Router.add(route));

				this.Router = Router;
				this.Router.navigate('');
				this.Router.navigateToMain();
			};
			routesAdd.$injector = ['larch.Router'];

			this.Injector.invoke(routesAdd);
		},
		init(fn) {
			// init
			this.Injector.invoke(fn);
		}, 
		run(fn) {
			this.Injector.invoke(fn);
		}
	}
};

export default Larch;