// import AppDispatcher from '../larch.dispatcher.es6';
import dragula from 'dragula';

const ctrl = function(Router, Widgets, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit');

	const scope = this.scope;

	// display widgets for current dashboard
	scope.dashboardId = Router.current.props.id;
	scope.widgetInstances = Dashboards.getWidgets(Router.current.props.id);
	scope.widgets = Widgets.getAllByIds(scope.widgetInstances);
	this.recompile();

	// add drag drop support
	dragula([document.getElementById('drag-drop-top'), document.getElementById('drag-drop-middle'), document.getElementById('drag-drop-bottom')]);

	this.methods = {
		/**
		 * toggle tab within edit modal
		 * @param  {Event} e  Event
		 * @param  {string} tabId HTML DOM tab id
		 */
		toggleTab(e, tabId) {
			e.preventDefault();
			const currentTab = document.querySelector('.tab-pane.active');

			if (currentTab.id !== tabId) {
				const newTab = document.querySelector(`#${tabId}`);
				const parentNew = e.target.parentNode;
				const parentCurrent = document.querySelector('.nav-tabs > .active');

				currentTab.classList.toggle('active');
				parentCurrent.classList.toggle('active');

				newTab.classList.toggle('active');
				parentNew.classList.toggle('active');
			}
		},
		close(e) {
			scope.modal.hide();
			scope.modal.reject('noe');
			delete scope.modal;
		},
		save(e) {
			scope.modal.hide();
			scope.modal.resolve('values');
			delete scope.modal;
		}
	};
};
ctrl.$injector = ['larch.Router', 'model.Widgets', 'model.Dashboards', 'larch.Logger'];

export default {
	id: 'ui.modal.edit',
	templateUrl: './ui/modal/modal.edit.hbs',
	scope: {},
	methods: {
		// widgets: [[],[],[]]
	},
	controller: ctrl
};