const ctrl = function(Dashboards, Router, Modal, Logger) {
	const logger = Logger.create('ui.sidebar');

	const updateSidebar = eventName => {
		logger.info(`${eventName} event received`);
		this.scope.route = Router.getCurrentId();
		this.scope.dashboards = Dashboards.cache;

		this.recompile();
	};

	// display all dashboards when loaded
	Dashboards.on('dashboards.updated-name', () => updateSidebar('dashboards.updated.name'));
	Dashboards.on('dashboards.updated', () => updateSidebar('dashboards.updated'));
	Dashboards.on('dashboards.liked', () => updateSidebar('dashboards.liked'));
	Dashboards.on('dashboards.shared', () => updateSidebar('dashboards.shared'));
	Router.on('router.navigate', () => updateSidebar('router.navigate'));

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
	onlyOnRecompile: false,
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;