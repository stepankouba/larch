import readline from 'readline';

const questions = {
	name: 'What is the widget name?',
	version: 'Widget version?'
};

function read() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});



	rl.question("What do you think of node.js? ", function(answer) {
		// TODO: Log the answer in a database
		console.log("Thank you for your valuable feedback:", answer);

		rl.close();
	});

}

const create = {
	subcommands: ['widget', 'source'],
	argsLength: 0,

	usage() {
		const text = [
			'',
			'larch create creates larch.package.json',
			''].join('\n');

		return text;
	},

	invoke() {
		read();
	}
};

export default create;