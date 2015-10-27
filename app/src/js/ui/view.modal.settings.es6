import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';
// import UI from '../lib/lib.ui.es6';

const ctrl = function(Router, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.settings');
	const scope = this.scope;

	Dashboards.on('dashboards.updated-name', id => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {success: 'GENERAL_RESULT_OK'});
	});

	Dashboards.on('dashboards.updated-name-not', errorText => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {errors: errorText});
	});

	this.methods = {
		update(e) {
			const errors = Form.testValues('settings-dashboard-form');
			Form.displayResults('.modal-detail:not(.hidden) .alert', {errors});

			if (!errors) {
				scope.ds = Form.getValues('settings-dashboard-form');

				// dispatch save
				AppDispatcher.dispatch('dashboards.update-name', [Router.getCurrentId(), scope.ds]);
			}
		},
		close(e) {
			e.preventDefault();

			scope.modal.hide();
			scope.modal.resolve();
			delete scope.modal;
		}
	};

	scope.ds = Dashboards.get(Router.current.props.id);
	this.recompile();
};
ctrl.$injector = ['larch.Router', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.settings',
	templateUrl: './modal.settings.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};