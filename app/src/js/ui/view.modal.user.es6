import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';
import UI from '../lib/lib.ui.es6';

const ctrl = function(User, Logger) {
	const logger = Logger.create('ui.modal.user');
	const scope = this.scope;
	const view = this;

	function update() {
		scope.user = User.current;

		view.recompile();
	}

	this.methods = {
		save(e, form) {
			e.preventDefault();

			const errors = Form.testValues(form);
			Form.displayResults('.modal-detail:not(.hidden) .alert', {errors});

			if (!errors) {
				scope.ds = Form.getValues(form);

				// dispatch save
				// AppDispatcher.dispatch('dashboards.create', scope.ds);
			}
		},
		show: UI.showOption,
		close(e) {
			e.preventDefault();

			scope.modal.hide();
			scope.modal.resolve();

			delete scope.modal;
			delete scope.newlyCreatedId;
		}
	};

	update();
};
ctrl.$injector = ['model.User', 'larch.Logger'];

export default {
	id: 'ui.modal.user',
	templateUrl: './modal.user.hbs',
	onlyOnRecompile: true,
	scope: {},
	methods: {},
	controller: ctrl
};