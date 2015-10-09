import DragDrop from './dragdrop.es6';
import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Widgets, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.widget.detail');

	const scope = this.scope;

	this.methods = {
		_retrieveSettings(id) {
			return Widgets.getWidgetSettings(scope.dashboard.widgets[id]);
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

			const settings = Form.getValues('edit-widget-form');

			AppDispatcher.dispatch('dashboards.settings', [dashboardId, widgetId, settings]);
		}
	};

	// display widgets for current dashboard
	scope.dashboardId = Router.current.props.id;
	scope.dashboard = Dashboards.get(scope.dashboardId);
	scope.widgets = Widgets.getAllByIds(scope.dashboard.widgets);

	// by default first widget is selected
	scope.selectedWidgetId = scope.selectedWidgetId || Dashboards.getFirstWidgetId(Router.current.props.id);
	scope.selectedWidgetSettings = this.methods._retrieveSettings(scope.selectedWidgetId);
	logger.log(scope);
	this.recompile();

	// add drag drop support
	DragDrop.init();
	DragDrop.onDrop((elMoved, sibling) => {
		// id target
	});
};
ctrl.$injector = ['larch.Router', 'model.Widgets', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.edit.widget.detail',
	templateUrl: './modal.edit.widget.detail.hbs',
	onlyOnRecompile: true,
	scope: {},
	methods: {},
	controller: ctrl
};