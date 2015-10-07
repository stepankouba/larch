import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Dashboards, Router, Logger) {
	const logger = Logger.create('ui.modal.remove');
	const scope = this.scope;

	Dashboards.on('dashboards.removed', id => {
		scope.removed = true;
		this.methods.close();
	});

	Dashboards.on('dashboards.not-removed', () => {
		scope.error = 'OTHER_ERROR';
		this.recompile();
		scope.modal.display();
		delete scope.error;
	});

	this.methods = {
		remove(e) {
			e.preventDefault();

			// dispatch save
			AppDispatcher.dispatch('dashboards.remove', Router.current.props.id);
		},
		close(e) {
			scope.modal.hide();
			scope.modal.resolve(true);
			delete scope.modal;
		}
	};

	scope.dashboard = Dashboards.get(Router.current.props.id);
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