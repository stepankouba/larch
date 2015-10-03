import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, Viewer, Widgets, Logger) {
	const logger = Logger.create('ui.modal.edit');
	const scope = this.scope;
	const VIEWS = {
		'tab-addwidget': 'ui.modal.edit.search',
		'tab-widgets': 'ui.modal.edit.widget.detail'
	};

	// handle when new widget was added
	Widgets.on('widgets.cached', id => {
		logger.log('added id', id);

		scope.selectedWidgetId = { selectedWidgetId: id };
		// change view to details
		this.methods.toggleTab.call(this, new Event('click'), 'tab-widgets', true,
				document.querySelector('.nav-tabs > li:nth-child(2)'));
	});

	this.methods = {
		_appendView(parentElementId, viewId) {
			logger.log('modal appends view');
			return Viewer.processView(document.getElementById(parentElementId), viewId, scope.selectedWidgetId);
		},
		/**
		 * toggle tab within edit modal
		 * @param  {Event} e  Event
		 * @param  {string} tabId HTML DOM tab id
		 */
		toggleTab(e, tabId, viewRequired = false, parentNewNode = e.target.parentNode) {
			e.preventDefault();
			const currentTab = document.querySelector('.tab-pane.active');

			function displayTab() {
				const newTab = document.querySelector(`#${tabId}`);
				const parentNew = parentNewNode;
				const parentCurrent = document.querySelector('.nav-tabs > .active');

				currentTab.classList.toggle('active');
				parentCurrent.classList.toggle('active');

				newTab.classList.toggle('active');
				parentNew.classList.toggle('active');
			}

			if (currentTab.id !== tabId) {
				// if selecting a tab requires loading new component, do it
				if (viewRequired) {
					this.methods._appendView(tabId, VIEWS[tabId])
						.then(displayTab)
						.catch(err => logger.log(err));
				} else {
					displayTab();
				}
			}
		},
		close(e) {
			AppDispatcher.dispatch('dashboards.udpate', Router.current.props.id);
			scope.modal.hide();
			scope.modal.resolve('modal closed');
			delete scope.modal;
		}
	};

	// initial display of tab.widgets
	this.methods._appendView('tab-widgets', VIEWS['tab-widgets'])
		.catch(err => logger.error(err));
};
ctrl.$injector = ['larch.Router', 'larch.Viewer', 'model.Widgets', 'larch.Logger'];

export default {
	id: 'ui.modal.edit',
	templateUrl: './ui/modal.edit.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};