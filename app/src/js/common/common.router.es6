import { assign, map2Array } from '../lib/lib.assign.es6';
import { EventEmitter } from 'events';

const RouterFn = function(Logger) {
	const logger = Logger.create('larch.Router');

	const Router = assign(EventEmitter.prototype, {
		current: {},
		conf(conf) {
			this.conf = conf;
			this.root = document.getElementsByTagName('base')[0].getAttribute('href').slice(0, -1);
		},
		routes: new Map(),
		_parseUrl(routeObj) {
			const regExtractPropNames = /{+|}+/g;
			const regHasProps = /{{(.*?)[\|\|.*?]?}}/g;
			const regReplaceProps = regHasProps;
			const url = routeObj.url;

			// get propnames
			const dirtyProps = url.match(regHasProps);
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

			const route = this._parseUrl(conf);

			this.routes.set(route.id, route);
		},
		navigate(url, emitEvent = true) {
			let route;
			let values;
			this.current = {};

			logger.log(`navigating to ${url}`);

			// this is replacing for ... of loop to save some 300kb and not to load polyfill
			this.routes.forEach(item => {
				const urlMatch = url.match(item.regexpUrl);
				if (!values && urlMatch) {
					values = urlMatch;
					route = item;
					// removing the first of the array, because it's the whole string
					values.shift();
				}
			});

			if (route) {
				const elem = document.querySelector('[data-router]');

				this.current.props = {};
				this.current.url = url;
				this.current.view = route.view;

				values.forEach((val, index) => {
					const key = route.props[index];
					this.current.props[key] = val;
				});

				// add required view to the element and keep Viewer to process it
				elem.setAttribute('data-view', route.view);

				window.history.pushState(null, null, this.root + url);

				// emit event
				if (emitEvent) {
					this.emit('router.navigate', this.current);
				}
			}
		},
		navigateToMain(emitEvent = true) {
			const main = map2Array(this.routes).filter(item => item.main)[0];

			if (main) {
				this.navigate(main.mainUrl, emitEvent);
			}
		}
	});

	return Router;
};
RouterFn.$injector = ['larch.Logger'];

export default RouterFn;