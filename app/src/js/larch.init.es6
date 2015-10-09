import Cookies from './lib/lib.cookies.es6';

const init = function(User, Dashboards, Logger) {
	const logger = Logger.create('app.init');

	const token = Cookies.getItem('larch.token');

	if (!token) {
		logger.log('token not found');

		// redirect to login page
		window.location = 'login.html';
	}

	// check if the token is really for the user...
	return User.getCurrent(token)
			.then(() => {
				logger.log('user properly logged in', User.current);

				return Dashboards.getAll(User.current.username);
			})
			;
};
init.$injector = ['model.User', 'model.Dashboards', 'larch.Logger'];

export default init;