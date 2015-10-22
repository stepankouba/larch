import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.dashboard');
	const scope = this.scope;

	Dashboards.on('dashboards.updated-name', id => {
		scope.udpated = 'OK';
		this.recompile();
		// delete so that another recompile does not have this value in tempalte
		delete scope.updated;
	});

	Dashboards.on('dashboards.updated-name-not', errorText => {
		scope.error = errorText;
		this.recompile();
		delete scope.error;
	});

	this.methods = {
		updateDashboard(e) {
			if (!Form.testValues('edit-dashboard-form')) {
				return false;
			}

			scope.ds = Form.getValues('edit-dashboard-form');

			AppDispatcher.dispatch('dashboards.update-name', [Router.getCurrentId(), scope.ds]);
		}
	};

	scope.ds = Dashboards.get(Router.current.props.id);
	this.recompile();
};
ctrl.$injector = ['larch.Router', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.edit.dashboard',
	templateUrl: './modal.edit.dashboard.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};