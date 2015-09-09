import { larch, commands } from './larch.es6';
import logger from './logger.es6';

// definition of all help text
const allHelp = [
	'',
	'usage: larch <command>',
	'',
	'where <command> is one of following:',
	`\t${commands.join(', ')}`,
	''].join('\n');

const help = {
	subcommands: ['all_commands', ...commands],
	argsLength: false,

	/**
	 * prints help usage
	 * @return {string} text
	 */
	usage() {
		const text = [
			'',
			'larch help <command> - prints out an information about a command',
			''].join('\n');

		return text;
	},

	/**
	 * invoke the help method
	 * @param  {string} subcommand subcommand to get help about
	 * @param  {Array}  args       arguments (no use for help)
	 */
	invoke(subcommand, args = []) {
		if (!subcommand) {
			subcommand = 'help';
		}

		if (!(subcommand in larch)) {
			subcommand = 'all_commands';
		}

		if (subcommand === 'all_commands') {
			logger.info(allHelp);
		} else {
			logger.info(larch[subcommand].usage());
		}

		process.exit();
	}
};

export default help;