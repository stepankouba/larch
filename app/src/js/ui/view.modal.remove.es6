import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';

const ctrl = function(Dashboards, Router, Logger) {
	const logger = Logger.create('ui.modal.remove');
	const scope = this.scope;

	Dashboards.on('dashboards.removed', id => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {success: 'GENERAL_RESULT_OK'});
	});

	Dashboards.on('dashboards.removed-not', errorText => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {errors: errorText});
	});

	this.methods = {
		remove(e) {
			e.preventDefault();

			// dispatch save
			AppDispatcher.dispatch('dashboards.remove', Router.getCurrentId());
		},
		close(e) {
			e.preventDefault();

			scope.modal.hide();
			scope.modal.resolve(true);
			delete scope.modal;
		}
	};

	scope.dashboard = Dashboards.get(Router.getCurrentId());
	this.recompile();
};
ctrl.$injector = ['model.Dashboards', 'larch.Router','larch.Logger'];

export default {
	id: 'ui.modal.remove',
	templateUrl: './modal.remove.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};