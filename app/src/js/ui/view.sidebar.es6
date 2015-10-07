import AppDispatcher from '../larch.dispatcher.es6';
import Cookies from '../lib/lib.cookies.es6';

const ctrl = function(Dashboards, Router, Modal, Logger) {
	const logger = Logger.create('ui.sidebar');

	const updateSidebar = eventName => {
		logger.info(`${eventName} event received`);
		this.scope.dashboards = Dashboards.cache;

		this.recompile();
	};

	// display all dashboards when loaded
	Dashboards.on('dashboards.loaded', () => updateSidebar('dashboards.loaded'));
	Dashboards.on('dashboards.updated', () => updateSidebar('dashboards.updated'));

	// handle router in sidebar
	Router.on('router.navigate', route => {
		logger.info('router.navigate event received');
		// this.scope.route = route.props.id;

		// last seen id is stored in cookie
		if (route.props.id !== 'home') {
			Cookies.setItem('larch.lastSeenId', route.props.id, undefined, '/build');
			// logger.log(route.props.id);
		}

		this.recompile();
	});

	// definition of methods available as event handlers
	this.methods = {
		navigate(e, id) {
			e.preventDefault();

			Router.navigate(`${id}`);

			return false;
		}
	};

};
ctrl.$injector = ['model.Dashboards', 'larch.Router', 'component.Modal','larch.Logger'];

const View = {
	id: 'ui.sidebar',
	templateUrl: './sidebar.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;