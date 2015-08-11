'use strict';

import { Global } from './larch.lib.es6';

let RouterFn = function(HTTPer, Logger, Viewer) {
	let logger = Logger.create('larch.Router');
	const openReg = '{{';
	const closeReg = '}}';

	let Router = {	
		conf(conf) {
			this.conf = conf;
			this.root = Global.window.location();
		},
		views: [],
		routes: [],
		_parseUrl(routObj) {
			let regProp = new Regexp('{{([a-zA-Z_][a-zA-Z_0-9])*}}', 'g');
			//let regUrl = 

			//'/dashboard/test/hehe/{{id}}/{{state}}'.match('^\/(([a-zA-Z_]*\/)+){{', 'g')[1]
			
			// create regexpUrl
			// create properties
			// 

		},
		add(conf) {
			if (!conf.templateUrl || !conf.controller || !conf.url) {
				return logger.error('Router not defined properly');
			}

			// if there are properties in URL
			if (conf.url.indexOf(openReg) > -1) {
				this._parseUrl(conf);
			}

			this.routes.push(conf);

			return this;
		},
		remove(url) {
			this.routes = this.routes.map(item => {
				if (item.url !== url) {
					return item;
				}
			});

			return this;
		},
		navigate(url) {

			let route = this.routes.filter(item => item.url === url)[0];

			window.history.pushState(null, null, this.root + url);

			if (route) {
				Viewer.insert(route.templateUrl);
			}
		},
		navigateToMain() {
			let main = this.routes.filter(item => item.main)[0];

			if (main) {
				this.navigate(main.url);
			}
		}
	};

	return Router;
};
RouterFn.$injector = ['larch.HTTPer', 'larch.Logger', 'larch.Viewer'];

export default RouterFn;