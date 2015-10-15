import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(Router, User, Sources, Logger) {
	const logger = Logger.create('ui.modal.accounts.detail');
	const view = this;
	const scope = this.scope;

	function updateDetail(sources) {
		scope.sources = sources || Sources.cache;
		scope.sourcesSettings = User.getSourcesSettings();
		scope.selectedSourceName = scope.selectedSourceName || 'lo-github';

		view.recompile();
	}

	Sources.on('sources.loaded', r => updateDetail(r));

	this.methods = {
		add() {
			const source = 'lo-github';
			const w = window.open(`http://localhost:3333/build/auth.html?source=${source}&user=${User.current.id}`,
				'larch_auth_source', 'height=800, width=1000, top=500, left=200, scrollable=yes, menubar=yes, resizable=yes');

			window.larch.authSourceResponse = function(result) {
				logger.log('result from window w is:', result);
				w.close();
			};

			return false;
		},
		showSettings(e, id) {
			e.preventDefault();

			logger.log('showing settings', scope);

			updateDetail();
		},
		saveChanges(e) {
			AppDispatcher.dispatch('users.settings', undefined);
		}
	};

	AppDispatcher.dispatch('sources.get-all', undefined);
};
ctrl.$injector = ['larch.Router', 'model.User', 'model.Sources', 'larch.Logger'];

export default {
	id: 'ui.modal.accounts.detail',
	templateUrl: './modal.accounts.detail.hbs',
	onlyOnRecompile: true,
	scope: {},
	methods: {},
	controller: ctrl
};