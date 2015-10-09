const run = function(Router, Logger) {
	const logger = Logger.create('app.run');

	// const timeLoad = (PerformanceTiming.domInteractive - PerformanceTiming.navigationStart) / 1000;
	// const timeLaunch = (PerformanceTiming.loadEventEnd - PerformanceTiming.loadEventStart) / 1000;

	logger.log('larch application started');
	// logger.log(`app loaded in: ${timeLoad}s`);
	// logger.log(`app started in: ${timeLaunch}s`);

	Router.emit('router.navigate', Router.current);
};
run.$injector = ['larch.Router', 'larch.Logger'];

export default run;