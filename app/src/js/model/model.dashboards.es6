import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const DashboardsMdlFn = function(User, DashboardSrvc, Cookies, Logger) {
	const logger = Logger.create('model.Dashboards');

	// define model
	const DashboardsMdl = assign(EventEmitter.prototype, {
		cache: {},
		/**
		 * get all dashboards for particular user
		 * @param  {string} user username
		 */
		getAll(user) {
			return DashboardSrvc.getAll(user)
				.then(data => {
					logger.log(`tracing get all request`);

					data.forEach(i => DashboardsMdl.cache[i.id] = i);

					DashboardsMdl.emit('dashboards.loaded');
				})
				.catch(err => logger.error(err));
		},
		/**
		 * get dashboard
		 * @param  {String|Number} 	id Dashboard id if string, or position in cahce if Number
		 * @return {Object}    Dashboard object
		 */
		get(id) {
			if (Number.isInteger(id)) {
				return DashboardsMdl.cache[Object.keys(DashboardsMdl.cache)[id]];
			} else {
				return DashboardsMdl.cache[id];
			}
		},
		/**
		 * remove item from a cache
		 * @param  {String} id
		 */
		removeFromCache(id) {
			delete DashboardsMdl.cache[id];
		},
		/**
		 * test wether, there is any dashboard for a user
		 * @return {Boolean}
		 */
		hasAny() {
			return Object.keys(DashboardsMdl.cache).length > 0;
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

			logger.log('creating new dashbord', newDS);

			DashboardSrvc.save(newDS)
				.then(result => {
					const newDS = result.data.changes[0].new_val;

					DashboardsMdl.cache[newDS.id] = newDS;
					DashboardsMdl.emit('dashboards.created', newDS.id);
				})
				.catch(err => {
					logger.error(err);
					if (err.data && err.data.msg === 'SAME_NAME_EXISTS') {
						DashboardsMdl.emit('dashboards.created-not', 'SAME_NAME_EXISTS_ERR');
					} else {
						DashboardsMdl.emit('dashboards.created-not', 'CREATE_ERR');
					}
				});
		},
		createFromShared(url) {
			logger.log('createing new dashboard from shared', url);

			// get id from public url
			DashboardSrvc.saveFromShared(url)
				.then(result => {
					const newDS = result.data.changes[0].new_val;

					DashboardsMdl.cache[newDS.id] = newDS;
					DashboardsMdl.emit('dashboards.created', newDS.id);
				})
				.catch(err => {
					logger.error(err);
					DashboardsMdl.emit('dashboards.created-not', err.data.msg || 'CREATE_ERR');
				});
			// send request to the db
		},
		/**
		 * Add widget to the current dashboard
		 * @param {Array} params
		 * @param {String} params[]  id of the dashboard
		 * @param {Object} params[]  widget id
		 * @param {Number} params[]  row in dashboard
		 */
		addWidget([id, widgetId, row]) {
			let position;

			logger.log('adding new widget to the dashboard');

			const currentDashboard = DashboardsMdl.get(id);
			// check rows and positions
			if (row === 0 || row === 2) {
				position = 0;
			} else {
				// take first free position in middle row
				const ws = currentDashboard.widgets;
				position = Object.keys(ws).filter(k => ws[k].display.row === 1).length;
			}

			currentDashboard.widgets[widgetId] = {
				display: {row, position},
				settings: undefined
			};
		},
		_update(id, data, eventName) {
			logger.log('updating dashboard', id);

			if (data.id || data.owner || data.layout) {
				return DashboardsMdl.emit('dashboards.not-updated', 'UPDATE_FIELDS_NOT_ALLOWED_ERR');
			}

			return DashboardSrvc.update(id, data)
				.then(result => {
					// update dashboard in the cache
					DashboardsMdl.cache[id] = result;
					DashboardsMdl.emit(eventName, id);
				})
				.catch(err => {
					logger.error(err);
					DashboardsMdl.emit(`${eventName}-not`, err);
				});
		},
		remove(id) {
			DashboardSrvc.remove(id)
				.then(res => {
					// remove from cache
					DashboardsMdl.removeFromCache(id);
					// remove cookie
					DashboardsMdl.removeLastSeenId();
					// emit event
					DashboardsMdl.emit('dashboards.removed', id);
				})
				.catch(err => DashboardsMdl.emit('dashboards.removed-not', err.data.msg || 'REMOVE_ERR'));
		},
		updateName([id, data]) {
			logger.log(`udpating name for ${id}`, data);
			const newName = data.name;

			// check for the same name
			const sameName = Object.keys(DashboardsMdl.cache).filter(k => {
				const did = DashboardsMdl.get(k);
				return (did.name === newName && did.id !== id);
			});

			if (sameName.length > 0) {
				return DashboardsMdl.emit('dashboards.updated-name-not', 'SAME_NAME_EXISTS_ERR');
			}

			DashboardsMdl._update(id, data, 'dashboards.updated-name');
		},
		like(id) {
			const currentDashboard = DashboardsMdl.get(id);
			const like = !currentDashboard.like;

			DashboardsMdl._update(id, { like }, 'dashboards.liked');
		},
		getFreeSlots(id, height = 0) {
			const currentDashboard = DashboardsMdl.get(id);
			const widgets = currentDashboard.widgets;
			const slots = [0,1,1,1,2];

			let freeSlots;

			Object.keys(widgets).forEach(key => slots.splice(slots.indexOf(widgets[key].display.row), 1));

			if (height > 0 && height < 151) {
				freeSlots = slots.filter(item => item === 1);
			} else if (height > 0 && height > 150) {
				freeSlots = slots.filter(item => item !== 1);
			}

			return freeSlots;
		},
		/**
		 * get the id of the first widget. This is used for default selection of a widget for edit
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		getFirstWidgetId(id) {
			const w = DashboardsMdl.get(id).widgets;

			return Object.keys(w)[0];
		},
		/**
		 * update settings of a widgets instances
		 * if widgetId undefined, method assumes, that newSettings is complete widgets object of dashboard object
		 * i.e.: {
		 * 		"id": {settings},
		 * 		"id": {settings}
		 * }
		 *
		 * @param {Array} payload
		 * @param {String} payload[0] dashboardId
		 * @param {String} payload[1] widgetId
		 * @param {Object} payload[2] newSettings
		 */
		setSettings([dashboardId, widgetId, newSettings]) {
			logger.log(`saving settings for ${dashboardId}`, newSettings);
			const currentDashboard = DashboardsMdl.get(dashboardId);
			let widgets;

			if (widgetId) {
				// this is the simplest way of cloning objects
				widgets = JSON.parse(JSON.stringify(currentDashboard.widgets));
				widgets[widgetId].settings = [widgetId].settings || {};

				Object.keys(newSettings).forEach(k => {
					widgets[widgetId].settings[k] = newSettings[k];
				});
			} else {
				widgets = newSettings;
			}

			DashboardsMdl._update(dashboardId, { widgets }, 'dashboards.updated-settings');
		},
		share([dashboardId, type, users = undefined]) {
			logger.log(`sharing ${dashboardId} as ${type} for`, users);

			DashboardsMdl._update(dashboardId, {shared: type}, 'dashboards.shared');
		},
		unshare(dashboardId) {
			logger.log(`removing sharing of ${dashboardId}`);

			DashboardSrvc.removeSharing(dashboardId)
				.then(result => {
					DashboardsMdl.cache[dashboardId] = result;
					DashboardsMdl.emit('dashboards.shared', dashboardId);
				})
				.catch(err => DashboardsMdl.emit('dashboards.shared-not', err));
		},
		getLastSeenId() {
			const username = User.current.username;
			return Cookies.get(`${username}.lastSeenId`);
		},
		setLastSeenId(id) {
			const username = User.current.username;
			Cookies.set(`${username}.lastSeenId`, id);
		},
		removeLastSeenId() {
			const username = User.current.username;
			Cookies.remove(`${username}.lastSeenId`);
		}
	});

	// register actions
	AppDispatcher.register('Dashboards', 'dashboards.getAll', DashboardsMdl.getAll);
	AppDispatcher.register('Dashboards', 'dashboards.addWidget', DashboardsMdl.addWidget);
	AppDispatcher.register('Dashboards', 'dashboards.create', DashboardsMdl.create);
	AppDispatcher.register('Dashboards', 'dashboards.create-from', DashboardsMdl.createFromShared);
	AppDispatcher.register('Dashboards', 'dashboards.remove', DashboardsMdl.remove);
	AppDispatcher.register('Dashboards', 'dashboards.like', DashboardsMdl.like);
	AppDispatcher.register('Dashboards', 'dashboards.update-name', DashboardsMdl.updateName);
	AppDispatcher.register('Dashboards', 'dashboards.share', DashboardsMdl.share);
	AppDispatcher.register('Dashboards', 'dashboards.unshare', DashboardsMdl.unshare);
	AppDispatcher.register('Dashboards', 'dashboards.settings', DashboardsMdl.setSettings);

	return DashboardsMdl;
};
DashboardsMdlFn.$injector = ['model.User', 'service.Dashboard', 'larch.Cookies', 'larch.Logger'];

export default {
	name: 'model.Dashboards',
	model: DashboardsMdlFn
};