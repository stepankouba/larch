import AppDispatcher from './larch.dispatcher.es6';

const run = function(User, Logger) {
	const logger = Logger.create('app.run');

	logger.log('application started');

	// ask for all dashboards
	AppDispatcher.dispatch('dashboards.getAll', User.current.username);
};
run.$injector = ['model.User', 'larch.Logger'];

export default run;