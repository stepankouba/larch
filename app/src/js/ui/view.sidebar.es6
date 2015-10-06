import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Dashboards, Router, Modal, Logger) {
	const logger = Logger.create('ui.sidebar');

	// display all dashboards when loaded
	Dashboards.on('dashboards.loaded', () => {
		logger.info('dashboards.loaded event received');
		this.scope.dashboards = Dashboards.cache;
		this.recompile();
	});

	// handle router in sidebar
	Router.on('router.navigate', route => {
		logger.info('router.navigate event received');
		// this.scope.route = route.props.id;
		this.recompile();
	});

	// assign event handlers
	AppDispatcher.dispatch('dashboards.getAll', 'test@test.com');

	this.scope.route = Router.current.props.id;

	// definition of methods available as event handlers
	this.methods = {
		navigate(e, url) {
			e.preventDefault();
			Router.navigate(url);
			return false;
		}
	};

};
ctrl.$injector = ['model.Dashboards', 'larch.Router', 'component.Modal','larch.Logger'];

const View = {
	id: 'ui.sidebar',
	templateUrl: './ui/sidebar.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;