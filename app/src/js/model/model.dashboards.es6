import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const DashboardsMdlFn = function(DashboardSrvc, Logger) {
	const logger = Logger.create('model.Dashboards');

	// define dispatcher registers
	const dispatchers = {
		/**
		 * get all dashboards for particular user
		 * @param  {string} user username
		 */
		getAll(user) {
			DashboardsMdl.getAll(user)
				.then(() => DashboardsMdl.emit('dashboards.loaded'))
				.catch(err => logger.error(err));
		},
		/**
		 * [addWidget description]
		 * @param {[type]} [id       [description]
		 * @param {[type]} widget    [description]
		 * @param {[type]} position] [description]
		 */
		addWidget([id, widget, position]) {
			logger.log('adding new widget to the dashboard');
			// add widget instance
			DashboardsMdl.addWidget(id, widget, position);
		},
		update(id) {
			logger.log('updating dashboard', id);

			DashboardsMdl.update(id)
				.then(() => DashboardsMdl.emit('dashboards.updated', id))
				.catch(err => logger.error(err));
		}
	};

	// register actions
	AppDispatcher.register('Dashboards', 'dashboards.getAll', dispatchers.getAll);
	AppDispatcher.register('Dashboards', 'dashboards.addWidget', dispatchers.addWidget);
	AppDispatcher.register('Dashboards', 'dashboards.udpate', dispatchers.update);

	// define model
	const DashboardsMdl = assign(EventEmitter.prototype, {
		cache: [],
		getAll(user) {
			const self = this;

			return new Promise((resolve, reject) => {
				DashboardSrvc.getAll(user)
					.then(data => {
						self.cache = data;
						resolve(true);
					})
					.catch(err => reject(err));
			});
		},
		addWidget(id, widget, row) {
			let position;

			const currentDashboard = this.cache.filter(item => item.id === id)[0];
			// check rows and
			if (row === 0 || row === 2) {
				position = 0;
			} else {
				// take first free position in middle row
				const ws = currentDashboard.widgets;
				position = Object.keys(ws).filter(k => ws[k].display.row === 1).length;
			}

			currentDashboard.widgets[widget.id] = {
				display: {row, position},
				settings: undefined
			};
		},
		update(id) {
			const currentDashboard = this.cache.filter(item => item.id === id)[0];

			// TODO: save to DB
			return Promise.resolve(true);
		},
		getFreeSlots(id, height = 0) {
			logger.log(id, height);
			const currentDashboard = this.cache.filter(item => item.id === id)[0];
			const widgets = currentDashboard.widgets;
			const slots = [0,1,1,1,2];

			let freeSlots;

			Object.keys(widgets).forEach(key => slots.splice(slots.indexOf(widgets[key].display.row), 1));

			if (height > 0 && height < 150) {
				freeSlots = slots.filter(item => item === 1);
			} else if (height > 0 && height > 149) {
				freeSlots = slots.filter(item => item !== 1);
			}

			return freeSlots;
		},
		/**
		 * get widget instances hold by a dashboard
		 * @param  {String} id dashboard id
		 * @return {Object}    hash map of objects
		 */
		getWidgetInstances(id) {
			const currentDashboard = this.cache.filter(item => item.id === id)[0];
			
			return currentDashboard.widgets;
		},
		/**
		 * get the id of the first widget. This is used for default selection of a widget for edit
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getFirstWidgetId(id) {
			const w = this.getWidgetInstances(id);

			return Object.keys(w)[0];
		},
		setSetting(id, widgetId, name, value) {
			logger.log('changing settings for', id, widgetId, name, value);

			const currentDashboard = this.cache.filter(item => item.id === id)[0];
			const settings = currentDashboard.widgets[widgetId].settings || {};
			settings[name] = value;

			currentDashboard.widgets[widgetId].settings = settings;
		}
	});

	return DashboardsMdl;
};
DashboardsMdlFn.$injector = ['service.Dashboard', 'larch.Logger'];

export default {
	name: 'model.Dashboards',
	model: DashboardsMdlFn
};