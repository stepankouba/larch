import {EventEmitter} from 'events';
import {assign} from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

let DashboardsMdlFn = function(DashboardSrvc, Logger) {
	let logger = Logger.create('model.Dashboards');
	 
	// define dispatcher registers
	let dispatchers = {
		getAll(data) {
			DashboardsMdl.getAll(data)
				.then(() => DashboardsMdl.emit('dashboards.getAll'))
				.catch(err => logger.error(err));
		}
	};

	// register actions
	AppDispatcher.register('Dashboards', 'dashboards.getAll', dispatchers.getAll);

	// define model
	let DashboardsMdl = assign(EventEmitter.prototype, {
		list: undefined,
		getAll(userId) {
			let self = this;
			let p = new Promise(function(resolve, reject){
				DashboardSrvc.getAll(userId)
					.then(data => {
						self.list = data;
						resolve(true);
					})
					.catch(err => reject(err));
			});

			return p;
		}
	});

	return DashboardsMdl;
};
DashboardsMdlFn.$injector = ['service.Dashboard', 'larch.Logger'];

export default {
		name: 'model.Dashboards',
		model: DashboardsMdlFn
	};