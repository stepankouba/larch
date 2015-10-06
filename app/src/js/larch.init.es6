import Cookies from './lib/lib.cookies.es6';

const init = function(User, Logger) {
	const logger = Logger.create('app.init');

	const token = Cookies.getItem('larch.token');

	if (!token) {
		logger.log('token not found');

		// redirect to login page
		window.location = 'login.html';
	}

	return User.getCurrent(token)
			.then(() => logger.log('user properly logged in', User.current));
};
init.$injector = ['model.User', 'larch.Logger'];

export default init;