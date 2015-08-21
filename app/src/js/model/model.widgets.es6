import {EventEmitter} from 'events';
import {assign} from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

let WidgetsMdlFn = function (WidgetSrvc, FileSrvc, WidgetClass, Logger) {
	let logger = Logger.create('model.Widgets');

	// register action
	AppDispatcher.register('Widgets', 'widgets.getAll', function(data){
		data.forEach(w => {
			let widget;
			let widgetId = w.widgetId;

			WidgetMdl.get(widgetId)
				.then(widgetObj => {
					widget = widgetObj;

					// send the loaded widget into view
					WidgetMdl.emit('widgets.loaded', widget);
				})
				.catch(err => {
					logger.error(err);
				});
		});	
	});
	 
	// create model object
	let WidgetMdl = assign(EventEmitter.prototype, {
		get(id) {
			let userParams;
			let widget;

			// firstly get widget definition from DB
			return WidgetSrvc.getById(id)
				.then(data => {
					// get widget settings
					userParams = data.params;

					return FileSrvc.getFile('./../larch_modules/' + data.type + '/index.js');
				})
				.then(file => {
					// get the definition
					let w = eval(file);

					return WidgetClass.create(w, userParams);
				})
				.then(widgetObj => {
					widget = widgetObj;

					// get data from the source
					return widget.getData();
				})
				.then(data => {
					widget.data = data;
					// store the widget in list of widgets
					this.list.set(widget.id, widget);

					return Promise.resolve(widget);
				});
		},

		list: new Map(),
	});

	return WidgetMdl;
};
WidgetsMdlFn.$injector = ['service.Widget', 'service.File', 'class.Widget','larch.Logger'];

export default {
		name: 'model.Widgets',
		model: WidgetsMdlFn
	};