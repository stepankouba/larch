import DragDrop from './dragdrop.es6';
import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Widgets, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.widget.detail');
	const view = this;
	const scope = this.scope;

	function updateDetail() {
		// display widgets for current dashboard
		scope.dashboardId = Router.current.props.id;
		scope.dashboard = Dashboards.get(scope.dashboardId);
		scope.widgets = Widgets.getAllByIds(scope.dashboard.widgets);

		// by default first widget is selected
		scope.selectedWidgetId = scope.selectedWidgetId || Dashboards.getFirstWidgetId(Router.current.props.id);
		scope.selectedWidgetSettings = Widgets.getWidgetSettings(scope.dashboard.widgets[scope.selectedWidgetId]);
		view.recompile();

		// add drag drop support
		DragDrop.init();
		DragDrop.onDrop((elMoved, sibling) => {
			// id target
		});
	}

	Dashboards.on('dashboards.updated-settings', id => {
		scope.updated = 'OK';
		updateDetail();
		// delete so that another recompile does not have this value in tempalte
		delete scope.updated;
	});

	Dashboards.on('dashboards.updated-settings-not', errorText => {
		scope.error = errorText;
		updateDetail();
		delete scope.error;
	});

	this.methods = {
		showSettings(e, id) {
			e.preventDefault();

			logger.log('showing settings', scope);

			updateDetail();
		},
		saveChanges(e) {
			const widgetId = scope.selectedWidgetId;
			const dashboardId = Router.current.props.id;

			const settings = Form.getValues('edit-widget-form');

			AppDispatcher.dispatch('dashboards.settings', [dashboardId, widgetId, settings]);
		}
	};

	updateDetail();
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