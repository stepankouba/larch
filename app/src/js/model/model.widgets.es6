import {EventEmitter} from 'events';
import {assign} from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const WidgetsMdlFn = function(WidgetSrvc, DataSrvc, Logger) {
	const logger = Logger.create('model.Widgets');

	// register action
	AppDispatcher.register('Widgets', 'widgets.getAll', dashboard => {
		logger.log(`receiving data for ${dashboard.widgets}`);

		dashboard.widgets.forEach(w => {
			WidgetMdl.get(w)
				.then(widget => {
					// send the loaded widget into view
					WidgetMdl.emit('widgets.loaded', widget);
				})
				.catch(err => {
					logger.error(err);
				});
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
		 * @param  {[type]} w [description]
		 * @return {[type]}   [description]
		 */
		get(w) {
			let widget;

			// TODO: implement cache

			return WidgetSrvc.getById(w.widgetId)
				.then(data => {
					widget = data[0];
					// get only latest version
					widget.version = data[0].versions[0];
					delete widget.versions;

					return DataSrvc.getData(widget, w.settings);
				})
				.then(data => {
					widget.data = data;

					this.cache[widget.id] = widget;

					return Promise.resolve(widget);
				});
		},
		/**
		 * [getAllByIds description]
		 * @param  {Objects[]} widgetsSettings array which is returned by Dashboards.getWidgets
		 * @return {[type]}                 [description]
		 */
		getAllByIds(widgetsSettings) {
			const result = {};

			widgetsSettings.forEach(item => result[item.widgetId] = this.cache[item.widgetId]);

			return result;
		}
	});

	return WidgetMdl;
};
WidgetsMdlFn.$injector = ['service.Widget', 'service.Data', 'larch.Logger'];

export default {
	name: 'model.Widgets',
	model: WidgetsMdlFn
};