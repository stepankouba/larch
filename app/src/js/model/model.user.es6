import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';
import Cookies from '../lib/lib.cookies.es6';

const UserMdlFn = function(UserSrvc, Logger) {
	const logger = Logger.create('model.User');

	// create model object
	const UserMdl = assign(EventEmitter.prototype, {
		COOKIE_AGE: 24 * 60 * 60,
		current: {},
		/**
		 * login user
		 * @param  {Object} user
		 * @param  {String} user.username
		 * @param  {String} user.password
		 */
		login(user) {
			UserSrvc.login(user)
				.then(data => {
					Cookies.setItem('larch.token', data.token, new Date(data.user.exp * 1000));
					UserMdl.emit('user.logged', data.user);
				})
				.catch(err => {
					if (err.statusCode === 401) {
						UserMdl.emit('user.not-logged', 'WRONG_USERNAME_AND_PASS');
					} else {
						UserMdl.emit('user.not-logged', 'ERROR');
					}
				});
		},
		/**
		 * load data for a current user
		 * @return {Promise.true}       [description]
		 */
		getCurrent() {
			return UserSrvc.getCurrent()
					.then(data => {
						UserMdl.current = data.user;
						return Promise.resolve(true);
					});
		},
		logout() {
			logger.log('logging out user');
			UserSrvc.logout()
				.then(() => {
					Cookies.removeItem('larch.token');
					window.location = 'login.html';
				});
		},
		/**
		 * get particular setting for a source belonging to user
		 * @param  {String} source source name
		 * @return {String|Object} whatever is defined for a source in user's settings
		 */
		getSourceSetting(source) {
			return UserMdl.current.settings.sources[source];
		},
		/**
		 * get sources defined for the user
		 * @return {[type]} [description]
		 */
		getSourcesSettings() {
			return UserMdl.current.settings.sources;
		}
	});

	AppDispatcher.register('User', 'user.login', UserMdl.login);
	AppDispatcher.register('User', 'user.logout', UserMdl.logout);

	return UserMdl;
};
UserMdlFn.$injector = ['service.User', 'larch.Logger'];

export default {
	name: 'model.User',
	model: UserMdlFn
};