import { LarchRegistry, LarchFS } from '../lib/';
import logger from './logger.es6';
import WidgetValidator from './publish.widget.validator.es6';

const publish = {
	subcommands: false,
	argsLength: false,

	usage() {
		const text = [
			'',
			'larch publish is used for publish a widget or source system definition to the repository',
			'Use larch publish in directory, where larch.package.json is stored',
			'',
			'usage: larch publish [registryURL]',
			'\tregistry URL is optional parameter to specify URL',
			''].join('\n');
		return text;
	},

	invoke(subcommand, args) {
		let widget;
		let rc;
		const currentDir = process.cwd();

		try {
			widget = require(`${currentDir}/larch.package.json`);
		} catch (e) {
			logger.error('larch.package.json was not found in this directory');
		}

		try {
			rc = LarchFS.loadConfig(`${currentDir}/.larchrc`);
			if (!rc.token) {
				throw new Error('no token');
			}
		} catch (e) {
			logger.error('user is not logged in. Use larch login command before larch publish');
		}

		// optional argument specifying registry url
		if (args && args[0]) {
			LarchRegistry.registryURL = args[0];
		}

		// load index.es6 into version definition
		widget.version = LarchRegistry.loadIndex(currentDir);

		// // perform checks on json
		LarchRegistry.testConf(widget, WidgetValidator, rc)
			// .then(LarchRegistry.createGzip(currentDir))
			.then(LarchRegistry.postToServer)
			.then(res => {
				logger.info('package was succesfully stored in the registry.');
				logger.info(`visit: www.larch.io/widget/${res.id}`);
				process.exit();
			})
			.catch(err => logger.error(err));
	}
};

export default publish;