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
		}
	};

	// register actions
	AppDispatcher.register('Dashboards', 'dashboards.getAll', dispatchers.getAll);

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
		getWidgets(id) {
			const currentDashboard = this.cache.filter(item => item.id === id);

			return currentDashboard[0].widgets;
		},
		getWidgetSettings(dashboardId, widgetId) {
			const widgets = this.getWidgets(dashboardId);

			return widgets[widgetId].settings;
		}
	});

	return DashboardsMdl;
};
DashboardsMdlFn.$injector = ['service.Dashboard', 'larch.Logger'];

export default {
	name: 'model.Dashboards',
	model: DashboardsMdlFn
};