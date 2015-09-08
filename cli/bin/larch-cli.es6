/**
 * larch-cli.es6
 */
import { larch } from '../src/larch.es6';
import logger from '../src/logger.es6';

// omit first two args from node call (e.g. node larch-cli.es6 test widget)
const args = process.argv.slice(2);

// if no command or command is not in larch
if (args.length === 0 || !(args[0] in larch)) {
	logger.log('no command used, printing default help for all commands');
	args[0] = 'help';
	args[1] = 'all_commands';
}

/**
 * check whether command is properly used according to it's specification
 * @param  {string} cmd  command string
 * @param  {Array}  args all other arguments including subcommand
 * @return {boolean} result of check
 */
function properUsage(cmd, args = []) {
	let subcmd;

	if (larch[cmd].subcommands) {
		logger.log('subcommands required');

		// command requries subcommands, but there aren't any
		if (args.length === 0) {
			logger.log('subcommands required but not passed');
			return false;
		}

		subcmd = args.shift(1);

		if (larch[cmd].subcommands.indexOf(subcmd) === -1) {
			logger.log('wrong subcommand passed');
			return false;
		}
	}

	// if command requires checking of args
	if (larch[cmd].argsLength !== false) {
		logger.log('command requires checking of args length');

		if (args.length !== larch[cmd].argsLength) {
			logger.log('wrong length of arguments');
			return false;
		}
	}

	logger.log('right command invoke');
	return true;
}

// test proper usage, if not, switch to help
// this ensures, that help shows text for par
if (!properUsage(args[0], args.slice(1))) {
	args.unshift('help');
}

// invoke command wihtout command itself
const cmd = args.shift();
const subcmd = (larch[cmd].subcommands) ? args.shift() : undefined;

larch[cmd].invoke(subcmd, args);
