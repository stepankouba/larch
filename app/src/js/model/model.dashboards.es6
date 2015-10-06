import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const DashboardsMdlFn = function(User, DashboardSrvc, Logger) {
	const logger = Logger.create('model.Dashboards');

	// define model
	const DashboardsMdl = assign(EventEmitter.prototype, {
		cache: [],
		/**
		 * get all dashboards for particular user
		 * @param  {string} user username
		 */
		getAll(user) {
			DashboardSrvc.getAll(user)
				.then(data => {
					DashboardsMdl.cache = data;
					DashboardsMdl.emit('dashboards.loaded');
				})
				.catch(err => logger.error(err));
		},
		/**
		 * get dashboard
		 * @param  {String} id Dashboard id
		 * @return {Object}    Dashboard object
		 */
		get(id) {
			return DashboardsMdl.cache.filter(item => item.id === id)[0];
		},
		/**
		 * create new dashboard
		 * @param  {Object} ds Dashboard object
		 */
		create(ds) {
			const defaultValues = {
				widgets: {},
				like: false,
				shared: false,
				owner: User.current.username
			};
			const newDS = Object.assign(ds, defaultValues);

			logger.log('creating new dashbord with settins', newDS);

			DashboardSrvc.save(newDS)
				.then(result => {
					const newId = result.data.generated_keys[0];
					// append new id to the dashboard
					newDS.id = newId;

					DashboardsMdl.cache.push(newDS);
					DashboardsMdl.emit('dashboards.created', newId);
				})
				.catch(err => {
					logger.error(err);
					if (err.data && err.data.msg === 'SAME_NAME_EXISTS') {
						DashboardsMdl.emit('dashboards.not-created', 'SAME_NAME_EXISTS');
					} else {
						DashboardsMdl.emit('dashboards.not-created', 'OTHER_ERROR');
					}
				});
		},
		/**
		 * Add widget to the current dashboard
		 * @param {Array} params
		 * @param {String} params[]  id of the dashboard
		 * @param {Object} params[]  widget object
		 * @param {Number} params[]  row in dashboard
		 */
		addWidget([id, widget, row]) {
			let position;

			logger.log('adding new widget to the dashboard');

			const currentDashboard = DashboardsMdl.get(id);
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
			const currentDashboard = DashboardsMdl.get(id);

			logger.log('updating dashboard', id);

			// TODO: save to DB
			DashboardsMdl.emit('dashboards.updated', id);
		},
		getFreeSlots(id, height = 0) {
			logger.log(id, height);
			const currentDashboard = DashboardsMdl.get(id);
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
			const currentDashboard = DashboardsMdl.get(id);
			logger.log(id, currentDashboard, DashboardsMdl.cache);
			return currentDashboard.widgets;
		},
		/**
		 * get the id of the first widget. This is used for default selection of a widget for edit
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getFirstWidgetId(id) {
			const w = DashboardsMdl.getWidgetInstances(id);

			return Object.keys(w)[0];
		},
		setSetting(id, widgetId, name, value) {
			logger.log('changing settings for', id, widgetId, name, value);

			const currentDashboard = DashboardsMdl.get(id);
			const settings = currentDashboard.widgets[widgetId].settings || {};
			settings[name] = value;

			currentDashboard.widgets[widgetId].settings = settings;
		}
	});

	// register actions
	AppDispatcher.register('Dashboards', 'dashboards.getAll', DashboardsMdl.getAll);
	AppDispatcher.register('Dashboards', 'dashboards.addWidget', DashboardsMdl.addWidget);
	AppDispatcher.register('Dashboards', 'dashboards.udpate', DashboardsMdl.update);
	AppDispatcher.register('Dashboards', 'dashboards.create', DashboardsMdl.create);

	return DashboardsMdl;
};
DashboardsMdlFn.$injector = ['model.User', 'service.Dashboard', 'larch.Logger'];

export default {
	name: 'model.Dashboards',
	model: DashboardsMdlFn
};