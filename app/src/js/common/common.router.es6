import { Global } from '../lib/lib.global.es6';
import { assign, map2Array } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';
import { EventEmitter } from 'events';

let RouterFn = function(Logger) {
	let logger = Logger.create('larch.Router');

	let Router = assign(EventEmitter.prototype, {
		current: {},
		conf(conf) {
			this.conf = conf;
			this.root = Global.document.base();
		},
		routes: new Map(),
		_parseUrl(routeObj) {
			let regExtractPropNames = /{+|}+/g;
			let regHasProps = /{{(.*?)[\|\|.*?]?}}/g;
			let regReplaceProps = regHasProps;
			let url = routeObj.url;

			// get propnames
			let dirtyProps = url.match(regHasProps);
			if (dirtyProps) {
				routeObj.props = dirtyProps.map(item => item.replace(regExtractPropNames, ''));
			}

			// create url regexp
			routeObj.regexpUrl = new RegExp(url.replace(regReplaceProps, '(.*)').replace('\/', '\/'), 'i');

			return routeObj;
		},
		add(conf) {
			if (!conf.view || !conf.url) {
				return logger.error('Router not defined properly');
			}

			let route = this._parseUrl(conf);

			this.routes.set(route.id, route);
		},
		navigate(url, emitEvent = true) {
			let route;
			let values;
			this.current = {};

			// this is replacing for ... of loop to save some 300kb and not to load polyfill
			this.routes.forEach(item => {
				let urlMatch = url.match(item.regexpUrl);
				if (!values && urlMatch) {
					values = urlMatch;
					route = item;
					// removing the first of the array, because it's the whole string
					values.shift();
				}
			});

			if (route) {
				let elem = document.querySelector('[data-router]');

				this.current.props = {};
				this.current.url = url;
				this.current.view = route.view;

				values.forEach((val, index) => {
					let key = route.props[index];
					this.current.props[key] = val;
				});
				
				// add required view to the element and keep Viewer to process it
				elem.setAttribute('data-view', route.view);

				window.history.pushState(null, null, this.root + url);

				// emit event
				if (emitEvent) {
					this.emit('router.navigate', route);
				}
			}
		},
		navigateToMain(emitEvent = true) {
			let main = map2Array(this.routes).filter(item => item.main)[0];
			
			if (main) {
				this.navigate(main.mainUrl, emitEvent);
			}
		}
	});

	return Router;
};
RouterFn.$injector = ['larch.Logger'];

export default RouterFn;