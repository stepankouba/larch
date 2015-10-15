import AppDispatcher from '../larch.dispatcher.es6';
import Handlebars from '../common/common.handlebars.es6';

const SEARCH_BOX = 'sources-search-box';

const ctrl = function(Router, User, Logger) {
	const logger = Logger.create('ui.modal.accounts.add');
	const input = document.getElementById(SEARCH_BOX);
	const resultTemplate = Handlebars.compile(document.getElementById('ui.modal.accounts.add.results').innerHTML);
	const resultsEl = document.getElementById('sources-result-list');
	const scope = this.scope;

	/**
	 * create results in the list
	 * @return {Object[]} array of widget definitions
	 */
	function createResults(results) {
		scope.results = results;

		resultsEl.innerHTML = resultTemplate(scope);
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
		}
	};
};
ctrl.$injector = ['larch.Router', 'model.User', 'larch.Logger'];

const View = {
	id: 'ui.modal.accounts.add',
	templateUrl: './modal.accounts.add.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;