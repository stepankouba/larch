import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';


const ctrl = function(Dashboards, Logger) {
	const logger = Logger.create('ui.modal.new');
	const scope = this.scope;

	Dashboards.on('dashboards.created', id => {
		scope.newlyCreatedId = id;
		this.methods.close();
	});

	Dashboards.on('dashboards.not-created', errorText => {
		scope.error = errorText;
		this.recompile();
		scope.modal.display();
		delete scope.error;
	});

	this.methods = {
		save(e) {
			e.preventDefault();

			if (!Form.testValues('edit-dashboard-form')) {
				return false;
			}

			scope.ds = Form.getValues('edit-dashboard-form');

			// dispatch save
			AppDispatcher.dispatch('dashboards.create', scope.ds);
		},
		close(e) {
			scope.modal.hide();
			scope.modal.resolve(scope.newlyCreatedId);
			delete scope.modal;
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