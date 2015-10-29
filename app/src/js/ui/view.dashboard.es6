import AppDispatcher from '../larch.dispatcher.es6';
import UI from '../lib/lib.ui.es6';
import Msg from '../larch.messages.es6';

const ctrl = function(Router, Widgets, Dashboards, Chart, Logger) {
	const logger = Logger.create('ui.dashboard');
	const scope = this.scope;
	const view = this;

	function reloadDashboard(eventName, id = Router.getCurrentId()) {
		logger.log(`${eventName} event received`);
		// display widgets for current dashboard
		scope.dashboard = Dashboards.get(id);
		view.recompile();
		AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
	}

	// handle router in sidebar
	Router.on('router.navigate', () => reloadDashboard('router.navigate'));

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.updated', () => reloadDashboard('dashboards.updated'));

	Widgets.on('widgets.data-loaded-not', (id, err) => UI.displayWidgetError(id, Msg.get(err)));

	// handle loaded widget event
	Widgets.on('widgets.data-loaded', widget => {
		logger.info('widgets.loaded event received, creating chart');

		// when there is something to draw
		if (widget.data) {
			const chart = Chart.create(widget);

			UI.removeLoader(`[id="container-widget${widget.id}"]`);

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