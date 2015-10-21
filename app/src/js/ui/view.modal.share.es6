import AppDispatcher from '../larch.dispatcher.es6';
// import Form from '../lib/lib.form.es6';

const ctrl = function(Dashboards, Router, Logger) {
	const logger = Logger.create('ui.modal.share');
	const scope = this.scope;
	const view = this;

	function updateView(forceGet = false) {
		scope.ds = Dashboards.get(Router.current.props.id);
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
			const dashboardId = Router.current.props.id;
			AppDispatcher.dispatch('dashboards.share', [dashboardId, false]);
		},
		sharePublic(e) {
			logger.log('sharing dashboard');
			const dashboardId = Router.current.props.id;
			AppDispatcher.dispatch('dashboards.share', [dashboardId, 'public']);
		},
		show(e, option) {
			// display detail
			const el = document.querySelector('#modal-detail');
			el.classList.toggle('hidden');
			// select option
			const div = document.querySelector(`#modal-option-${option}`);
			div.classList.toggle('selected');

			scope.selected = option;
		},
		close(e) {
			if (e) {
				e.preventDefault();
			}

			// Dashboards.emit('dashboards.updated', Router.current.props.id);
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