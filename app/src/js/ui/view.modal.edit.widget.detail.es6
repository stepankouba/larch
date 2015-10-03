import dragula from 'dragula';

const ctrl = function(Router, Widgets, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.widget.detail');

	const scope = this.scope;
	// display widgets for current dashboard
	scope.dashboardId = Router.current.props.id;
	scope.widgetInstances = Dashboards.getWidgetInstances(Router.current.props.id);
	scope.widgets = Widgets.getAllByIds(scope.widgetInstances);

	// add drag drop support
	dragula([document.getElementById('drag-drop-top'), document.getElementById('drag-drop-middle'), document.getElementById('drag-drop-bottom')]);

	this.methods = {
		_retrieveSettings(id) {
			return Widgets.getWidgetSettings(scope.widgetInstances[id]);
		},
		showSettings(e, id) {
			e.preventDefault();

			scope.selectedWidgetId = id;
			scope.selectedWidgetSettings = this.methods._retrieveSettings(id);

			logger.log('showing settings', scope);

			this.recompile();
		},
		saveChanges(e) {
			const widgetId = scope.selectedWidgetId;
			const dashboardId = Router.current.props.id;
			e.preventDefault();
			// get all inputs
			const inputs = document.querySelectorAll('input.settings');

			[].forEach.call(inputs, input => Dashboards.setSetting(dashboardId, widgetId, input.name, input.value));
		}
	};

	// by default first widget is selected
	scope.selectedWidgetId = scope.selectedWidgetId || Dashboards.getFirstWidgetId(Router.current.props.id);
	scope.selectedWidgetSettings = this.methods._retrieveSettings(scope.selectedWidgetId);
	this.recompile();
};
ctrl.$injector = ['larch.Router', 'model.Widgets', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.edit.widget.detail',
	templateUrl: './ui/modal.edit.widget.detail.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};