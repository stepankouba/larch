import Location from './lib/lib.location.es6';

const run = function(HTTPer, Logger) {
	const logger = Logger.create('auth.run');
	logger.log('larch auth started');

	const source = Location.search('source');
	const user = Location.search('user');
	const result = Location.search('result');
	const resultEl = document.getElementById('result');

	if (result) {
		// it's the callback result
		window.opener.larch.authSourceResponse(undefined, 'GENERAL_RESULT_OK');
	} else if (source) {
		// should initiate source
		window.location = `https://localhost:9101/api/user/${user}/auth/${source}`;
	} else {
		resultEl.innerHTML = 'didn\'t you forgot anything?';
	}
};
run.$injector = ['larch.HTTPer','larch.Logger'];

export default run;