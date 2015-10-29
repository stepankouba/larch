const init = function(User, Dashboards, Cookies, Router, Logger) {
	const logger = Logger.create('app.init');

	const token = Cookies.get('token');

	if (!token) {
		logger.log('token not found');

		// redirect to login page
		window.location = 'login.html';
	}

	// implementation of Router.navigateToMain
	Router.on('router.navigate-main', route => {
		// handle home
		const lastId = Dashboards.getLastSeenId();

		if (lastId && Dashboards.get(lastId)) {
			Router.navigate(`/dashboard/${lastId}`);
		} else if (Dashboards.hasAny()) {
			Router.navigate(`/dashboard/${Dashboards.get(0).id}`);
		} else {
			// use has no dashboard at all
			Router.navigate(`/dashboard/`);
		}
	});

	// handle router navigate - store last seen id
	Router.on('router.navigate', route => {
		if (route && route.props) {
			Dashboards.setLastSeenId(route.props.id);
		}
	});

	// check if the token is really for the user...
	return User.getCurrent()
			.then(() => {
				logger.log('user properly logged in', User.current);

				// then load all users dashboards
				return Dashboards.getAll(User.current.username);
			});
};
init.$injector = ['model.User', 'model.Dashboards', 'larch.Cookies', 'larch.Router', 'larch.Logger'];

export default init;