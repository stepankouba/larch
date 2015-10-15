import AppDispatcher from '../larch.dispatcher.es6';
import Handlebars from '../common/common.handlebars.es6';

const SEARCH_BOX = 'search-box';

const ctrl = function(WidgetSrvc, Router, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.search');
	const input = document.getElementById(SEARCH_BOX);
	const resultTemplate = Handlebars.compile(document.getElementById('ui.modal.edit.search.results').innerHTML);
	const resultsEl = document.getElementById('result-list');
	const dashboardId = Router.current.props.id;
	const scope = this.scope;

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
	 * show and hide drop down
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	function showDropdown(e) {
		// close already opened
		const opened = document.querySelector('.btn-group.open');
		if (opened) {
			opened.classList.toggle('open');
		}

		const menu = e.target.parentNode;
		menu.classList.toggle('open');

		// add event listeners to the created dropdowns
		const links = document.querySelectorAll('.btn-group.open .dropdown-menu li > a');
		[].forEach.call(links, el => el.addEventListener('click', e => {
			e.preventDefault();

			const params = e.target.getAttribute('data-add-widget').split(',');
			addWidget(params[0], parseInt(params[1], 10));
		}));

		return false;
	}

	/**
	 * create results in the list
	 * @return {Object[]} array of widget definitions
	 */
	function createResults(results) {

		if (results.length > 0) {
			scope.emptySlots = {};
			results.forEach(r => scope.emptySlots[r.name] = Dashboards.getFreeSlots(dashboardId, r.versions[0].client.display.height));
		}

		scope.results = results;

		resultsEl.innerHTML = resultTemplate(scope);
		// add dynamically event handlers to the buttons
		[].forEach.call(document.querySelectorAll('button[data-toggle="dropdown"]'), el => el.addEventListener('click', showDropdown));
	};

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
			WidgetSrvc.getByText(value)
				.then(result => {
					scope.value = value;
					createResults(result);
				})
				.catch(err => logger.error(err));
		}
	};
};
ctrl.$injector = ['service.Widget', 'larch.Router', 'model.Dashboards', 'larch.Logger'];

const View = {
	id: 'ui.modal.edit.search',
	templateUrl: './modal.edit.search.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;