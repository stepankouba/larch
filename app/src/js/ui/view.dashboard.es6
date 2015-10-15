import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Widgets, Dashboards, Chart, Logger) {
	const logger = Logger.create('ui.dashboard');
	const scope = this.scope;
	const view = this;

	function reloadDashboard(eventName, id = Router.current.props.id) {
		logger.log(`${eventName} event received`);
		// display widgets for current dashboard
		scope.dashboard = Dashboards.get(id);
		view.recompile();
		AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
	}

	// handle router in sidebar
	Router.on('router.navigate', router => reloadDashboard('router.navigate'));

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.updated', () => reloadDashboard('dashboards.updated'));

	Widgets.on('widgets.data-loaded-not', err => logger.log(err));

	// handle loaded widget event
	Widgets.on('widgets.data-loaded', widget => {
		logger.info('widgets.loaded event received, creating chart');

		// when there is something to draw
		if (widget.data) {
			const chart = Chart.create(widget);

			chart.removeLoader(`[id="container-widget${widget.id}"]`);

			chart.append(`[id="widget${widget.id}"]`);
		}
	});
};
ctrl.$injector = ['larch.Router', 'model.Widgets', 'model.Dashboards', 'component.Chart', 'larch.Logger'];

export default {
	id: 'ui.dashboard',
	templateUrl: './dashboard.hbs',
	scope: {},
	controller: ctrl
};