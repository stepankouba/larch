import Form from '../lib/lib.form.es6';
import Cookies from '../lib/lib.cookies.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const ctrl = function(User, Logger) {
	const logger = Logger.create('ui.login');

	User.on('user.logged', data => {
		Cookies.setItem('larch.token', data.token, new Date(data.user.exp * 1000));
		window.location = 'index.html';
	});

	User.on('user.not-logged', error => {
		this.scope.result = { error };
		this.recompile();
	});

	// definition of methods available as event handlers
	this.methods = {
		login(e) {
			e.preventDefault();

			const user = Form.getValues();

			AppDispatcher.dispatch('user.login', user);
		}
	};

};
ctrl.$injector = ['model.User', 'larch.Logger'];

export default {
	id: 'ui.login',
	templateUrl: './ui/login.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};