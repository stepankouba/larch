import Cookies from './lib/lib.cookies.es6';

const init = function(User, Dashboards, Router, Logger) {
	const logger = Logger.create('app.init');

	const token = Cookies.getItem('larch.token');

	if (!token) {
		logger.log('token not found');

		// redirect to login page
		window.location = 'login.html';
	}

	// implementation of Router.navigateToMain
	Router.on('router.navigate-main', route => {
		// handle home
		const lastId = Cookies.getItem('larch.lastSeenId');

		if (lastId && Dashboards.get(lastId)) {
			Router.navigate(`/dashboard/${lastId}`);
		} else if (Dashboards.hasAny()) {
			Router.navigate(`/dashboard/${Dashboards.get(0).id}`);
		}
	});

	// handle router navigatre - store last seen id
	Router.on('router.navigate', route => {
		Cookies.setItem('larch.lastSeenId', route.props.id);
	});

	// check if the token is really for the user...
	return User.getCurrent()
			.then(() => {
				logger.log('user properly logged in', User.current);

				// then load all users dashboards
				return Dashboards.getAll(User.current.username);
			});
};
init.$injector = ['model.User', 'model.Dashboards', 'larch.Router', 'larch.Logger'];

export default init;