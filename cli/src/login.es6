import { larchRead } from '../lib/';
import questions from './login.questions.es6';

const login = {
	subcommands: false,
	argsLength: 0,

	usage() {
		const text = [
			'',
			'larch login is used for login user to registry',
			''].join('\n');
		return text;
	},

	invoke(subcommand, args) {
		const read = larchRead(questions);

		read()
			.then(val => {
				console.log(val);
				process.exit();
			})
			.catch(err => {
				console.log(err);
				process.exit(1);
			});
	}
};

export default login;