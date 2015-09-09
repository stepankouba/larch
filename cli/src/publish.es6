import { LarchRegistry } from '../lib/';
import logger from './logger.es6';
import WidgetValidator from './publish.widget.validator.es6';

const publish = {
	subcommands: false,
	argsLength: 0,

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
			rc = require(`${currentDir}/.larchrc`);
		} catch (e) {
			logger.error('user is not logged in. Use larch login command before larch publish');
		}

		// perform checks on json
		LarchRegistry.testConf(conf, WidgetValidator)
			.then(LarchRegistry.createGzip(currentDir))
			// .then(LarchRegistry.postToServer(conf, rc.token))
			.then(() => {
				logger.log('OK');
				process.exit();
			})
			.catch(err => {
				logger.error(err);
			});
	}
};

export default publish;