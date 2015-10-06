import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const UserMdlFn = function(UserSrvc, Logger) {
	const logger = Logger.create('model.User');

	// create model object
	const UserMdl = assign(EventEmitter.prototype, {
		COOKIE_AGE: 24 * 60 * 60,
		current: {
			username: 'test@test.com'
		},
		/**
		 * login user
		 * @param  {Object} user
		 * @param  {String} user.username
		 * @param  {String} user.password
		 */
		login(user) {
			UserSrvc.login(user)
				.then(user => {
					UserMdl.emit('user.logged', user);
				})
				.catch(err => {
					if (err.statusCode === 401) {
						UserMdl.emit('user.not-logged', 'WRONG_USERNAME_AND_PASS');
					} else {
						UserMdl.emit('user.not-logged', 'ERROR');
					}
				});
		},
		getCurrent(token) {
			if (!token) {
				return logger.error('token not set');
			}

			return UserSrvc.getCurrent()
					.then(user => {
						UserMdl.current = user;

						return Promise.resolve(true);
					});
		}
	});

	AppDispatcher.register('User', 'user.login', UserMdl.login);

	return UserMdl;
};
UserMdlFn.$injector = ['service.User', 'larch.Logger'];

export default {
	name: 'model.User',
	model: UserMdlFn
};