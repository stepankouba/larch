import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Widgets, Dashboards, Chart, Logger) {
	const logger = Logger.create('ui.dashboard');
	const scope = this.scope;

	function reloadDashboard(id = Router.current.props.id) {
		// display widgets for current dashboard
		scope.dashboard = Dashboards.get(id);
		scope.widgetInstances = Dashboards.getWidgetInstances(id);
		this.recompile();
	}

	// handle router in sidebar
	Router.on('router.navigate', route => {
		logger.info('router.navigate event received');

		reloadDashboard.bind(this)();
		AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
	});

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.loaded', () => {
		logger.info('dashboards.loaded event received');

		reloadDashboard.bind(this)();
		AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
	});

	Dashboards.on('dashboards.updated', id => {
		logger.info('dashboards.updated event received');

		reloadDashboard.bind(this)();

		const wi = Dashboards.getWidgetInstances(id);
		const w = Widgets.getAllByIds(wi);

		// after recompile add widgets
		Object.keys(w).forEach(k => {
			Widgets.getData(w[k], wi[k])
				.then(() => Widgets.emit('widgets.loaded', w[k]))
				.catch(err => logger.error(err));
		});
	});

	// handle loaded widget event
	Widgets.on('widgets.loaded', widget => {
		logger.info('widgets.loaded event received, creating chart');

		const chart = Chart.create(widget);

		chart.removeLoader(`[id="container-widget${widget.id}"]`);

		chart.append(`[id="widget${widget.id}"]`);
	});
};
ctrl.$injector = ['larch.Router', 'model.Widgets', 'model.Dashboards', 'component.Chart','larch.Logger'];

export default {
	id: 'ui.dashboard',
	templateUrl: './dash/dashboard.hbs',
	scope: {},
	controller: ctrl
};