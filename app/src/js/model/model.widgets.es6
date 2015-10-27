import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const WidgetsMdlFn = function(User, WidgetSrvc, DataSrvc, Logger) {
	const logger = Logger.create('model.Widgets');

	// create model object
	const WidgetMdl = assign(EventEmitter.prototype, {
		cache: {},
		cacheIsEmpty() {
			return !!this.cache.length;
		},
		/**
		 * get all widgets for particular dashboard
		 * @param  {[type]} dashboard [description]
		 * @return {[type]}           [description]
		 */
		getAll(dashboard) {
			logger.log(`receiving data for`, dashboard.widgets);

			Object.keys(dashboard.widgets).forEach(key => {
				const w = dashboard.widgets[key];

				WidgetMdl.get([key, w, dashboard])
					.catch(err => {
						logger.error(err);
					});
			});
		},
		/**
		 * add widget to cache
		 * @param {String} widgetId
		 */
		add(widgetId) {
			WidgetSrvc.getById(widgetId)
				.then(data => {
					// test that anything is there
					if (data.length === 0) {
						WidgetMdl.emit('widgets.data-not-added', widgetId);
					}

					WidgetMdl.cache[widgetId] = data[0];
					WidgetMdl.emit('widgets.added', data[0]);
				})
				.catch(err => WidgetMdl.emit('widgets.data-not-added', err));
		},
		/**
		 * get widgets
		 * @param  {string} id widget id
		 * @param  {Object} wi widget instance settings
		 * @param  {Object} dashboard dashboard object
		 * @return {Promise}
		 */
		get([id, wi, dashboard]) {
			let widget;

			logger.log(`loading widget ${id}`);

			return WidgetSrvc.getById(id)
				.then(data => {
					// test that anything is there
					if (data.length === 0) {
						WidgetMdl.emit('widgets.data-not-loaded', widget);
					}

					widget = data[0];

					// cache the widget
					WidgetMdl.cache[widget.id] = widget;

					return WidgetMdl.getData(widget, wi, dashboard);
				})
				.then(data => {
					WidgetMdl.cache[widget.id].data = data;
					// send the loaded widget into view
					WidgetMdl.emit('widgets.data-loaded', WidgetMdl.cache[widget.id]);
				})
				.catch(err => {
					WidgetMdl.emit('widgets.data-loaded-not', err);
				});
		},
		getData(widget, widgetInstance, dashboard) {
			// get data if needed
			if (widgetInstance.settings) {
				// in case of from shared ds
				if (dashboard.originId) {
					return DataSrvc.getPublicData(dashboard.id, widget.id);
				} else {
					return DataSrvc.getData(widget, widgetInstance.settings,
						User.getSourceSetting({id: widgetInstance.sourceId}));
				}
			}

			return Promise.resolve(widget);
		},
		/**
		 * [getAllByIds description]
		 * @param  {Object} widgetsInstances hashmap which is returned by Dashboards.getWidgets
		 * @return {[type]}                 [description]
		 */
		getAllByIds(widgetsInstances) {
			const result = {};

			Object.keys(widgetsInstances).forEach(key => result[key] = WidgetMdl.cache[key]);

			return result;
		},
		/**
		 * combine widget instance and default settings from widget
		 * @param  {Object} widgetInstance Widget instance object held by Dashboard
		 * @return {Object}                Settings
		 */
		getWidgetSettings(widgetInstance = {}) {
			let ws = widgetInstance.settings;

			logger.log('widget instances settings', ws);

			// if settings
			if (!ws) {
				const widget = WidgetMdl.cache[widgetInstance.id];
				ws = {};
				if (widget) {
					Object.keys(widget.version.general.params).forEach(key => ws[key] = '');
				}
			}

			return ws;
		}
	});

	// register action
	AppDispatcher.register('Widgets', 'widgets.getAll', WidgetMdl.getAll);
	AppDispatcher.register('Widgets', 'widgets.add', WidgetMdl.add);
	AppDispatcher.register('Widgets', 'widgets.load', WidgetMdl.get);

	return WidgetMdl;
};
WidgetsMdlFn.$injector = ['model.User', 'service.Widget', 'service.Data', 'larch.Logger'];

export default {
	name: 'model.Widgets',
	model: WidgetsMdlFn
};