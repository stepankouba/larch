import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(User, Dashboards, HTTPer, Modal, Router, Logger) {
	const logger = Logger.create('ui.header');
	const view = this;
	const scope = this.scope;

	function updateHeader() {
		const routeId = Router.getCurrentId();
		const ds = routeId ? Dashboards.get(routeId) : {};

		scope.user = User.current;
		scope.hasDashboards = Dashboards.hasAny();
		scope.hasLike = ds.like;
		scope.isFromShared = ds.fromShared;
		view.recompile();
	}

	// event handlers
	Dashboards.on('dashboards.liked', () => updateHeader('dashboards.liked'));
	Dashboards.on('dashboards.updated', () => updateHeader('dashboards.updated'));
	Router.on('router.navigate', () => updateHeader('router.navigate'));

	// by default display the header
	updateHeader();

	// define operations used in template
	this.methods = {
		settings(e, ...val) {
			e.preventDefault();
			logger.info('opening settings modal');

			const m = Modal.create('settings');

			m.open()
				.then(result => {
					logger.log(result);
				})
				.catch(err => logger.error(err));

		},
		openEdit(e) {
			e.preventDefault();
			logger.info('opening edit modal');

			const m = Modal.create('edit');

			m.open()
				.then(result => {
					logger.log(result);
				})
				.catch(err => logger.error(err));
		},
		newDashboard(e) {
			e.preventDefault();
			logger.info('opening new dashboard modal');

			const m = Modal.create('new');

			m.open()
				.then(newId => {
					if (newId) {
						Router.navigate(`/dashboard/${newId}`);
					}
				})
				.catch(() => logger.log('closed modal new'));
		},
		shareDashboard(e) {
			e.preventDefault();
			logger.info('opening new share dashboard modal');

			const m = Modal.create('share');

			m.open()
				.then(() => {
				})
				.catch(err => logger.error(err));
		},
		removeDashboard(e) {
			e.preventDefault();
			logger.info('opening new dashboard modal');

			const m = Modal.create('remove');

			m.open()
				.then(id => {
					logger.log('navigating to main after remove');
					Router.navigate('/dashboard/home');
				})
				.catch(err => logger.error(err));
		},
		likeDashboard(e) {
			e.preventDefault();

			AppDispatcher.dispatch('dashboards.like', Router.getCurrentId());
		},
		logout(e) {
			e.preventDefault();

			AppDispatcher.dispatch('user.logout');
		}
	};
};
ctrl.$injector = ['model.User', 'model.Dashboards','larch.HTTPer', 'component.Modal', 'larch.Router','larch.Logger'];

const View = {
	id: 'ui.header',
	templateUrl: './header.hbs',
	onlyOnRecompile: true,
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;