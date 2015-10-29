import AppDispatcher from '../larch.dispatcher.es6';
import Handlebars from '../common/common.handlebars.es6';
import UI from '../lib/lib.ui.es6';
import Form from '../lib/lib.form.es6';

const ctrl = function(Router, Viewer, Dashboards, Widgets, User, Logger) {
	const logger = Logger.create('ui.modal.edit');
	const scope = this.scope;
	const view = this;
	const dashboardId = Router.getCurrentId();
	const input = document.getElementById('search-box');

	/**
	 * drag drop handler
	 * @param  {Function} (el, target)       [description]
	 * @return {[type]}        [description]
	 */
	// DragDrop.onDrop((el, target) => {
	// 	const rows = ['drag-drop-top', 'drag-drop-middle', 'drag-drop-bottom'];
	// 	const wi = {};

	// 	rows.forEach((id, row) => {
	// 		const el = document.getElementById(id);

	// 		[].forEach.call(el.children, (ch, position) => {
	// 			const widgetId = ch.getAttribute('data-position-widget-id');

	// 			if (widgetId) {
	// 				wi[widgetId] = {
	// 					display: {
	// 						row,
	// 						position
	// 					}
	// 				};
	// 			}
	// 		});
	// 	});

	// 	AppDispatcher.dispatch('dashboards.settings', [dashboardId, undefined, wi]);
	// });

	function updateDetail() {
		// display widgets for current dashboard
		scope.dashboard = Dashboards.get(dashboardId);
		scope.widgets = Widgets.getAllByIds(scope.dashboard.widgets);

		// by default first widget is selected
		scope.selectedWidgetId = scope.selectedWidgetId || Dashboards.getFirstWidgetId(dashboardId);
		scope.selectedWidget = {
			settings: Widgets.getWidgetSettings(scope.dashboard.widgets[scope.selectedWidgetId]),
			sourceId: scope.dashboard.widgets[scope.selectedWidgetId].sourceId
		};

		// middle rows unm
		scope.middleRows = [0,1,2];

		// for select
		scope.allUserSources = User.getSourcesSettings();
		logger.log(scope.selectedWidgetSettings);
		view.recompile();
	}

	Dashboards.on('dashboards.updated-settings', id => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {success: 'GENERAL_RESULT_OK'});
	});

	Dashboards.on('dashboards.updated-settings-not', errorText => {
		Form.displayResults('.modal-detail:not(.hidden) .alert', {errors: errorText});
	});

	/**
	 * add widget from search
	 * @param {[type]} e   [description]
	 * @param {[type]} id  [description]
	 * @param {[type]} row [description]
	 */
	function addWidget(id, row) {
		logger.log(`addWidget: ${id} ${row}`);
		const widget = scope.results.filter(r => r.id === id)[0];
		// let Model do the work
		AppDispatcher.dispatch('dashboards.addWidget', [dashboardId, widget.id, row]);
		// add widget
		AppDispatcher.dispatch('widgets.add', widget.id);
	}

	/**
	 * create results in the list
	 * @return {Object[]} array of widget definitions
	 */
	function createResults(results) {
		const resultsEl = document.getElementById('result-list');
		const resultTemplate = Handlebars.compile(document.getElementById('ui.modal.edit.search.results').innerHTML);

		if (results.length > 0) {
			scope.emptySlots = {};
			results.forEach(r => scope.emptySlots[r.name] = Dashboards.getFreeSlots(dashboardId, r.versions[0].client.display.height));
		}

		scope.results = results;

		resultsEl.innerHTML = resultTemplate(scope);
	};

	// handle when new widget was added
	Widgets.on('widgets.added', widget => {
		logger.log('added id', widget.id);

		scope.selectedWidgetId = { selectedWidgetId: widget.id };
		// change view to details
		this.methods.toggleTab.call(this, new Event('click'), 'tab-widgets', true,
				document.querySelector('.nav-tabs > li:nth-child(2)'));
	});

	this.methods = {
		/**
		 * input box event handler
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		search(e) {
			const value = input.value.trim();

			if (value === '') {
				scope.value = '';
				return createResults([]);
			}

			// load complete widget definitions
			// WidgetSrvc.getByText(value)
			// 	.then(result => {
			// 		scope.value = value;
			// 		createResults(result);
			// 	})
			// 	.catch(err => logger.error(err));
		},
		addAccount(e, source) {
			const w = window.open(`http://localhost:3333/build/auth.html?source=${source}&user=${User.current.id}`,
				'larch_auth_source', 'height=800, width=1000, top=500, left=200, scrollable=yes, menubar=yes, resizable=yes');

			window.larch.authSourceResponse = function(err, result) {
				logger.log(err, result);
				if (err) {
					// do something
					return logger.log(err);
				}

				w.close();
				User.getCurrent()
					.then(() => {
						updateDetail();
						scope.modal.display();
					});
			};

			return false;
		},
		showSettings(e, id) {
			e.preventDefault();

			logger.log('showing settings', scope);
			scope.selectedWidgetId = id;
			updateDetail();
			scope.modal.display();
		},
		saveChanges(e) {
			const widgetId = scope.selectedWidgetId;

			const errors = Form.testValues('edit-widget-form');
			Form.displayResults('.modal-detail:not(.hidden) .alert', {errors});

			if (!errors) {
				const values = Form.getValues('edit-widget-form');
				const sourceId = values.sourceId;
				delete values.sourceId;

				const settings = {
					[widgetId]: {
						settings: values,
						sourceId
					}
				};

				AppDispatcher.dispatch('dashboards.settings', [dashboardId, undefined, settings]);
			}
		},
		show: UI.showOption,
		close(e) {
			e.preventDefault();

			scope.modal.hide();
			Dashboards.emit('dashboards.updated', dashboardId);
			scope.modal.resolve('modal closed');
			delete scope.modal;
		}
	};

	updateDetail();
};
ctrl.$injector = ['larch.Router', 'larch.Viewer', 'model.Dashboards', 'model.Widgets', 'model.User', 'larch.Logger'];

export default {
	id: 'ui.modal.edit',
	templateUrl: './modal.edit.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};