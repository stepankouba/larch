import AppDispatcher from '../larch.dispatcher.es6';
import UI from '../lib/lib.ui.es6';
// import Form from '../lib/lib.form.es6';

const ctrl = function(Dashboards, Router, Logger) {
	const logger = Logger.create('ui.modal.share');
	const scope = this.scope;
	const view = this;

	function updateView(forceGet = false) {
		scope.ds = Dashboards.get(Router.getCurrentId());
		view.recompile();
	}

	Dashboards.on('dashboards.shared', id => {
		scope.updated = 'OK';
		// TODO: remove when more options available
		updateView();
		// delete so that another recompile does not have this value in tempalte
		scope.modal.display();
		delete scope.updated;
	});

	Dashboards.on('dashboards.shared-not', errorText => {
		scope.error = errorText;
		// TODO: remove when more options available
		updateView();
		scope.modal.display();
		delete scope.error;
	});

	this.methods = {
		removeShared(e) {
			logger.log('remove sharing');
			const dashboardId = Router.getCurrentId();
			AppDispatcher.dispatch('dashboards.share', [dashboardId, false]);
		},
		sharePublic(e) {
			logger.log('sharing dashboard');
			const dashboardId = Router.getCurrentId();
			AppDispatcher.dispatch('dashboards.share', [dashboardId, 'public']);
		},
		show: UI.showOption,
		close(e) {
			if (e) {
				e.preventDefault();
			}

			scope.modal.hide();
			scope.modal.resolve('modal closed');
			delete scope.modal;
		}
	};

	updateView();
};
ctrl.$injector = ['model.Dashboards', 'larch.Router', 'larch.Logger'];

export default {
	id: 'ui.modal.share',
	templateUrl: './modal.share.hbs',
	onlyOnRecompile: true,
	scope: {},
	methods: {},
	controller: ctrl
};