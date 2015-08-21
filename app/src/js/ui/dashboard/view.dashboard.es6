import AppDispatcher from '../../larch.dispatcher.es6';

let ctrl = function(Widgets, Dashboards, Logger) {
	let logger = Logger.create('ui.dashboard');

	// on loading all dashboards, show the selected one
	Dashboards.on('dashboards.getAll', () => {
		this.scope.widgets = Dashboards.list[1].widgets;
		this.recompile();
		
		AppDispatcher.dispatch('widgets.getAll', Dashboards.list[1].widgets);
	});

	Widgets.on('widgets.loaded', (widget) => { 
		let parentElement = document.querySelector('[id="widget' + widget.id + '"]');

		widget.append(parentElement);
	})
};
ctrl.$injector = ['model.Widgets', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.dashboard',
	templateUrl: './dash/dashboard.html',
	scope: {},
	controller: ctrl
};