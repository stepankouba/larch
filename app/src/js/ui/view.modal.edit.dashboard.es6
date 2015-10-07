import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.dashboard');
	const scope = this.scope;

	this.methods = {
		updateDashboard(e) {
			if (!Form.testValues('edit-dashboard-form')) {
				return false;
			}

			scope.ds = Form.getValues('edit-dashboard-form');

			AppDispatcher.dispatch('dashboards.udpate', [Router.current.props.id, scope.ds]);
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