import AppDispatcher from '../larch.dispatcher.es6';
import Form from '../lib/lib.form.es6';


const ctrl = function(Dashboards, Logger) {
	const logger = Logger.create('ui.modal.new');
	const scope = this.scope;

	Dashboards.on('dashboards.created', id => {
		scope.newlyCreatedId = id;
		this.recompile()
			.then(scope.modal.display());
	});

	Dashboards.on('dashboards.not-created', errorText => {
		scope.error = errorText;
		this.recompile()
			.then(scope.modal.display());
	});

	this.methods = {
		save(e) {
			e.preventDefault();

			function testValues() {
				const fields = document.querySelectorAll('[data-model]');
				let result = true;

				[].forEach.call(fields, field => {
					const value = field.value.trim();
					if (!value) {
						field.parentNode.classList.toggle('has-error');
						result = false;
					} else {
						field.parentNode.classList.remove('has-error');
					}
				});

				return result;
			}

			if (!testValues()) {
				return false;
			}

			scope.ds = Form.getValues();

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
	templateUrl: './ui/modal.new.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};