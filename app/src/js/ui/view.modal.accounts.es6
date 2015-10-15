const ctrl = function(Router, Viewer, Dashboards, Widgets, Logger) {
	const logger = Logger.create('ui.modal.acocunts');
	const scope = this.scope;
	const VIEWS = {
		'tab-addaccount': 'ui.modal.accounts.add',
		'tab-accounts': 'ui.modal.accounts.detail'
	};

	this.methods = {
		_appendView(parentElementId, viewId) {
			logger.log('modal appends view');
			return Viewer.processView(document.getElementById(parentElementId), viewId, scope.selectedWidgetId);
		},
		/**
		 * hide dropdowns if opened in modal
		 * @param  {Event} e DOM event
		 */
		hideOpenDropdowns(e) {
			// close already opened
			const opened = document.querySelectorAll('.btn-group.open');
			if (e.target.tagName !== 'BUTTON' && opened.length) {
				[].forEach.call(opened, el => el.classList.toggle('open'));
			}
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
					this.methods._appendView(tabId, VIEWS[tabId]);
					displayTab();
				} else {
					displayTab();
				}
			}
		},
		close(e) {
			Dashboards.emit('dashboards.updated', Router.current.props.id);
			scope.modal.hide();
			scope.modal.resolve('modal closed');
			delete scope.modal;
		}
	};

	// initial display of tab.widgets
	this.methods._appendView('tab-accounts', VIEWS['tab-accounts']);
};
ctrl.$injector = ['larch.Router', 'larch.Viewer', 'model.Dashboards', 'model.Widgets', 'larch.Logger'];

export default {
	id: 'ui.modal.accounts',
	templateUrl: './modal.accounts.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};