import Form from '../lib/lib.form.es6';
import AppDispatcher from '../larch.dispatcher.es6';
import Msg from '../larch.messages.es6';

const ctrl = function(User, Logger) {
	const logger = Logger.create('ui.register');
	const scope = this.scope;

	User.on('user.registered', data => {
		window.location = 'index.html';
	});

	User.on('user.registered-not', error => {
		logger.log('error login', error);

		scope.error = Msg.get(error);

		this.recompile();

		delete scope.error;
	});

	// definition of methods available as event handlers
	this.methods = {
		register() {
			const user = Form.getValues('register-form');

			AppDispatcher.dispatch('user.register', user);
		}
	};

};
ctrl.$injector = ['model.User', 'larch.Logger'];

export default {
	id: 'ui.register',
	templateUrl: './register.hbs',
	scope: {},
	methods: {},
	controller: ctrl
};