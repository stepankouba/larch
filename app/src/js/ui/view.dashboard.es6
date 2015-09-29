import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Widgets, Dashboards, Chart, Logger) {
	const logger = Logger.create('ui.dashboard');

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.loaded', () => {
		logger.info('dashboards.loaded event received');
		this.scope.widgets = Dashboards.cache[0].widgets;

		AppDispatcher.dispatch('widgets.getAll', Dashboards.cache[0]);
	});

	// handle loaded widget event
	Widgets.on('widgets.loaded', widget => {
		logger.info('widgets.loaded event received, creating chart');

		const chart = Chart.create(widget);

		chart.removeLoader(`[id="container-widget${widget.id}"]`);

		chart.append(`[id="widget${widget.id}"]`);
	});
};
ctrl.$injector = ['model.Widgets', 'model.Dashboards', 'component.Chart','larch.Logger'];

export default {
	id: 'ui.dashboard',
	templateUrl: './dash/dashboard.hbs',
	scope: {},
	controller: ctrl
};