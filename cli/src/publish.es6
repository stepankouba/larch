import { LarchRegistry } from '../lib/';
import logger from './logger.es6';
import WidgetValidator from './publish.widget.validator.es6';

const publish = {
	subcommands: false,
	argsLength: false,

	usage() {
		const text = [
			'',
			'larch publish is used for publish a widget or source system definition to the repository',
			'Use larch publish in directory, where larch.package.json is placed',
			''].join('\n');
		return text;
	},

	invoke(subcommand, args) {
		// load json
		let conf;
		let rc;
		const currentDir = process.cwd();

		try {
			conf = require(`${currentDir}/larch.package.json`);
		} catch (e) {
			logger.error('larch.package.json was not found in this directory');
		}

		try {
			rc = require(`${currentDir}/larchrc.json`);
		} catch (e) {
			logger.error('user is not logged in. Use larch login command before larch publish');
		}

		// optional argument specifying registry url
		if (args && args[0]) {
			LarchRegistry.registryURL = args[0];
		}

		// perform checks on json
		LarchRegistry.testConf(conf, WidgetValidator)
			.then(LarchRegistry.createGzip(currentDir))
			.then(LarchRegistry.postToServer(conf, rc.token))
			.then(res => {
				logger.info('package was succesfully stored in the registry.');
				logger.info(`visit: www.larch.io/widget/${res.id}`);
				process.exit();
			})
			.catch(err => {
				logger.error(err.stack);
			});
	}
};

export default publish;