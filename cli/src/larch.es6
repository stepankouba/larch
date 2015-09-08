export const version = '0.1.0';

export const larch = {};

/**
 * list of commands and corresponding subcommands
 * @type {Object}
 */
export const commands = [
	'version',
	'help',
	'login',
	'create',
	// 'create',
	// 'test',
	// 'publish'
];

// add the commands to the larch object, which serves as container for commands
commands.forEach(command => {
	if (larch[command]) {
		return;
	}

	const file = `./${command}.es6`;

	larch[command] = require(file);
});