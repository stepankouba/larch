import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';
import UI from '../lib/lib.ui.es6';

const ctrl = function(Dashboards, Logger) {
	const logger = Logger.create('ui.modal.new');
	const scope = this.scope;

	Dashboards.on('dashboards.created', id => {
		scope.newlyCreatedId = id;
		Form.displayResults('.modal-detail:not(.hidden) .alert', {success: 'GENERAL_RESULT_OK'});
	});

	Dashboards.on('dashboards.created-not', errorText => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {errors: errorText});
	});

	this.methods = {
		saveBaseOnURL(e) {
			e.preventDefault();

			const errors = Form.testValues('new-ds-shared');
			Form.displayResults('.modal-detail:not(.hidden) .alert', {errors});

			if (!errors) {
				AppDispatcher.dispatch('dashboards.create-from', Form.getValues('new-ds-shared').url);
			}
		},
		save(e) {
			e.preventDefault();

			const errors = Form.testValues('edit-dashboard-form');
			Form.displayResults('.modal-detail:not(.hidden) .alert', {errors});

			if (!errors) {
				scope.ds = Form.getValues('edit-dashboard-form');

				// dispatch save
				AppDispatcher.dispatch('dashboards.create', scope.ds);
			}
		},
		show: UI.showOption,
		close(e) {
			e.preventDefault();

			scope.modal.hide();

			if (scope.newlyCreatedId) {
				scope.modal.resolve(scope.newlyCreatedId);
			} else {
				scope.modal.reject();
			}

			delete scope.modal;
			delete scope.newlyCreatedId;
		}
	};
};
ctrl.$injector = ['model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.new',
	templateUrl: './modal.new.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};