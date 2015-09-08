import questions from './create.widget.questions.es6';
import { larchRead, larchFS } from '../lib/';

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
			console.log(this.usage());
			process.exit();
		}

		const doesExist = larchFS.fileExisting();

		doesExist()
			.then(larchRead(questions))
			.then(larchFS.save())
			.then(() => {
				process.exit();
			})
			.catch(err => {
				console.log(err);
				process.exit();
			});
	}
};

export default create;