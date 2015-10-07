import Awesomplete from 'awesomplete';
import AppDispatcher from '../larch.dispatcher.es6';

const SEARCH_BOX = 'search-box';

const ctrl = function(WidgetSrvc, Router, Dashboards, Logger) {
	const logger = Logger.create('ui.modal.edit.search');
	const input = document.getElementById(SEARCH_BOX);
	const aws = new Awesomplete(input);
	const scope = this.scope;
	const self = this;

	logger.log('search', input);

	this.methods = {
		/**
		 * recompile after gathering all data
		 * @return {[type]} [description]
		 */
		_updateResults() {
			scope.emptySlots = {};

			const dashboardId = Router.current.props.id;
			// TODO: remove this exception in accessing latest version
			scope.results.forEach(r => scope.emptySlots[r.name] = Dashboards.getFreeSlots(dashboardId, r.versions[0].client.display.height));

			self.recompile();
		},
		/**
		 * add widget from search
		 * @param {[type]} e   [description]
		 * @param {[type]} id  [description]
		 * @param {[type]} row [description]
		 */
		addWidget(e, id, row) {
			e.preventDefault();
			const widget = scope.results.filter(r => r.id === id)[0];
			// let Model do the work
			AppDispatcher.dispatch('dashboards.addWidget', [Router.current.props.id, widget, row]);
			// add widget
			AppDispatcher.dispatch('widgets.load', [widget.id, widget]);
		},
		/**
		 * show and hide drop down
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		showDropdown(e) {
			e.preventDefault();
			const menu = e.target.parentNode;
			menu.classList.toggle('open');
			return false;
		},
		/**
		 * input box event handler
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		searchAutocomplete(e) {
			const value = document.getElementById(SEARCH_BOX).value;

			if (value.length < 2 || e.keyCode === 27) {
				return false;
			}

			if (e.keyCode === 13 && value.length >= 2) {
				this.methods._updateResults();
			}

			WidgetSrvc.getByText(value)
				.then(result => {
					scope.value = value;
					scope.results = result;
					const sugg = [];
					result.forEach(r => sugg.push(r.name));

					aws.list = sugg;
					aws.evaluate();
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