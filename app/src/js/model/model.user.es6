import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';
import Errors from '../larch.errors.es6';

const UserMdlFn = function(UserSrvc, Cookies, Logger) {
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
					Cookies.set('token', data.token, {end: new Date(data.user.exp * 1000)});
					UserMdl.emit('user.logged', data.user);
				})
				.catch(err => {
					if (err.statusCode === 401) {
						UserMdl.emit('user.logged-not', Errors.WRONG_USERNAME_AND_PASS);
					} else {
						UserMdl.emit('user.logged-not', Errors.LOGIN_ERR);
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
					Cookies.remove('token');
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
		},
		/**
		 * check the password
		 * - Contain at least 6 characters
		 * - contain at least 1 number
		 * - contain at least 1 lowercase character (a-z)
		 * - contain at least 1 uppercase character (A-Z)
		 * - contains only 0-9a-zA-Z
		 * @param  {[type]}  pass [description]
		 * @return {Boolean}      [description]
		 */
		isPassword(pass) {
			return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(pass);
		},
		/**
		 * register user
		 * @param  {Object} user
		 * @param  {String} user.password	password
		 * @param  {String} user.username	email
		 * @return {[type]}      [description]
		 */
		register(user) {
			const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			if (!user.username || !user.password) {
				return UserMdl.emit('user.registered-not', Errors.REGISTER_MISSING_DATA);
			}

			if (!re.test(user.username)) {
				return UserMdl.emit('user.registered-not', Errors.INVALID_EMAIL);
			}

			if (user.password !== user.confirmPassword) {
				return UserMdl.emit('user.registered-not', Errors.REGISTER_CONFIRM_PASS);
			}

			if (!UserMdl.isPassword(user.password)) {
				return UserMdl.emit('user.registered-not', Errors.INVALID_PASS);
			}

			delete user.confirmPassword;

			UserSrvc.register(user)
				.then(data => {
					logger.log(data);
					Cookies.set('token', data.token, {end: new Date(data.user.exp * 1000)});
					UserMdl.emit('user.registered', data.user);
				})
				.catch(err => {
					UserMdl.emit('user.registered-not', Errors[err.data.msg] || Errors.LOGIN_ERR);
				});

		}
	});

	AppDispatcher.register('User', 'user.login', UserMdl.login);
	AppDispatcher.register('User', 'user.logout', UserMdl.logout);
	AppDispatcher.register('User', 'user.register', UserMdl.register);

	return UserMdl;
};
UserMdlFn.$injector = ['service.User', 'larch.Cookies', 'larch.Logger'];

export default {
	name: 'model.User',
	model: UserMdlFn
};