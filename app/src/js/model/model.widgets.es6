import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const WidgetsMdlFn = function(WidgetSrvc, DataSrvc, Logger) {
	const logger = Logger.create('model.Widgets');

	// register action
	AppDispatcher.register('Widgets', 'widgets.getAll', dashboard => {
		logger.log(`receiving data for`, dashboard.widgets);

		Object.keys(dashboard.widgets).forEach(key => {
			const w = dashboard.widgets[key];

			WidgetMdl.get(key, w)
				.then(widget => {
					// send the loaded widget into view
					WidgetMdl.emit('widgets.loaded', widget);
				})
				.catch(err => {
					logger.error(err);
				});
		});
	});

	AppDispatcher.register('Widgets', 'widgets.cacheWidget', ([id, w]) => {
		logger.log(`loading widget ${id}`);

		WidgetMdl.get(id, w)
			.then(widget => {
				// send the loaded widget into view
				WidgetMdl.emit('widgets.cached', widget.id);
			})
			.catch(err => {
				logger.error(err);
			});
	});

	// create model object
	const WidgetMdl = assign(EventEmitter.prototype, {
		cache: {},
		cacheIsEmpty() {
			return !!this.cache.length;
		},
		/**
		 * get widgets
		 * @param  {string} id widget id
		 * @param  {Object} wi widget instance settings
		 * @return {Promise}
		 */
		get(id, wi) {
			let widget;

			// TODO: implement cache

			return WidgetSrvc.getById(id)
				.then(data => {
					widget = data[0];
					// get only latest version
					widget.version = data[0].versions[0];
					delete widget.versions;

					return this.getData(widget, wi);
				});
		},
		getData(widget, widgetInstance) {
			return new Promise((resolve, reject) => {
				// get data if needed
				if (widgetInstance.settings) {
					return DataSrvc.getData(widget, widgetInstance.settings)
						.then(data => {
							widget.data = data;

							this.cache[widget.id] = widget;

							return resolve(widget);
						})
						.catch(err => reject(err));
				} else {
					this.cache[widget.id] = widget;
					
					return resolve(widget);
				}
			});
		},
		/**
		 * [getAllByIds description]
		 * @param  {Object} widgetsInstances hashmap which is returned by Dashboards.getWidgets
		 * @return {[type]}                 [description]
		 */
		getAllByIds(widgetsInstances) {
			const result = {};

			Object.keys(widgetsInstances).forEach(key => result[key] = this.cache[key]);

			return result;
		},
		/**
		 * combine widget instance and default settings from widget
		 * @param  {Object} widgetInstance Widget instance object held by Dashboard
		 * @return {Object}                Settings
		 */
		getWidgetSettings(widgetInstance) {
			let ws = widgetInstance.settings;

			// if setting
			if (!ws) {
				const widget = this.cache[widgetInstance.id];
				ws = {};

				Object.keys(widget.version.general.params).forEach(key => ws[key] = '');
			}

			return ws;
		}
	});

	return WidgetMdl;
};
WidgetsMdlFn.$injector = ['service.Widget', 'service.Data', 'larch.Logger'];

export default {
	name: 'model.Widgets',
	model: WidgetsMdlFn
};