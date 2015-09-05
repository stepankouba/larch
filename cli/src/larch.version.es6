import { version as larchVersion } from './larch.es6';

const version = {
	subcommands: false,
	argsLength: false,

	usage() {
		const text = [
			'',
			'larch version returns version of the CLI',
			''].join('\n');

		return text;
	},

	invoke() {
		console.log(`larch cli version: ${larchVersion}`);
		process.exit();
	}
};

export default version;