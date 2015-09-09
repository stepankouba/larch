import questions from './create.widget.questions.es6';
import { larchRead, LarchFS } from '../lib/';
import logger from './logger.es6';

const create = {
	subcommands: ['widget', 'source'],
	argsLength: 0,

	/**
	 * return string with help
	 * @return {string} help string
	 */
	usage() {
		const text = [
			'',
			'larch create <command> creates a larch.package.json',
			'\tAvailable commands are:',
			'\twidget - for creating new widget definition file',
			'\tsource - for creating new source system definition file',
			''].join('\n');

		return text;
	},

	/**
	 * invoke create command
	 * @param  {string} subcommand either 'widget' or 'source'
	 * @param  {Array}  args       any other arguments (no used in create)
	 */
	invoke(subcommand, args = []) {
		// test the subcommand
		if (!subcommand || this.subcommands.indexOf(subcommand) === -1) {
			logger.error(this.usage());
			process.exit();
		}

		const doesExist = LarchFS.fileExisting();

		doesExist()
			.then(larchRead(questions))
			.then(LarchFS.save())
			.then(() => {
				process.exit();
			})
			.catch(err => {
				logger.error(err);
			});
	}
};

export default create;