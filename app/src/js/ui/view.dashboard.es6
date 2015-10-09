import AppDispatcher from '../larch.dispatcher.es6';
import Cookies from '../lib/lib.cookies.es6';

const ctrl = function(Router, Widgets, Dashboards, Chart, Logger) {
	const logger = Logger.create('ui.dashboard');
	const scope = this.scope;

	function reloadDashboard(id = Router.current.props.id) {
		if (id !== 'home') {
			// display widgets for current dashboard
			scope.dashboard = Dashboards.get(id);
			this.recompile();
		}
	}

	// handle router in sidebar
	Router.on('router.navigate', route => {
		logger.info('router.navigate event received');

		reloadDashboard.bind(this)();

		if (scope.dashboard) {
			AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
		}
	});

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.loaded', () => {
		logger.info('dashboards.loaded event received');

		// handle home
		if (Router.current.props.id === 'home') {
			const lastId = Cookies.getItem('larch.lastSeenId');

			if (lastId && Dashboards.get(lastId)) {
				Router.navigate(`/dashboard/${lastId}`);
			} else if (Dashboards.hasAny()) {
				Router.navigate(`/dashboard/${Dashboards.get(0).id}`);
			}
		} else {
			reloadDashboard.bind(this)();
			AppDispatcher.dispatch('widgets.getAll', scope.dashboard);
		}
	});

	Dashboards.on('dashboards.updated', id => {
		logger.info('dashboards.updated event received');

		reloadDashboard.bind(this)();

		const wi = Dashboards.getWidgetInstances(id);
		const w = Widgets.getAllByIds(wi);

		// after recompile add widgets
		Object.keys(w).forEach(k => {
			console.log(w[k], wi[k]);
			Widgets.getData(w[k], wi[k])
				.then(() => Widgets.emit('widgets.data-loaded', w[k]))
				.catch(err => logger.error(err));
		});
	});

	Widgets.on('data-not-loaded', () => logger.log('data were not loaded, try again later'));

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