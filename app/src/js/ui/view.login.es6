import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';
import Msg from '../larch.messages.es6';

const ctrl = function(User, Logger) {
	const logger = Logger.create('ui.login');
	const scope = this.scope;

	User.on('user.logged', data => {
		window.location = 'index.html';
	});

	User.on('user.logged-not', error => {
		logger.log('error login', error);

		scope.error = Msg.get(error);

		this.recompile();

		delete scope.error;
	});

	// definition of methods available as event handlers
	this.methods = {
		login(e) {
			e.preventDefault();
			const user = Form.getValues('login-form');

			AppDispatcher.dispatch('user.login', user);
		}
	};

};
ctrl.$injector = ['model.User', 'larch.Logger'];

export default {
	id: 'ui.login',
	templateUrl: './login.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};