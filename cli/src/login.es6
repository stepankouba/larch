import { larchRead, larchFS } from '../lib/';
import questions from './login.questions.es6';

// TODO: replace this with real login call, when user service is implemented
function loginAPI(user) {
	// let {username, password} = user;

	return Promise.resolve({token: 1234567890});
}

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
			.then(loginAPI)
			.then(larchFS.save('./.larchrc'))
			.catch(err => {
				console.log(err);
				process.exit(1);
			});
	}
};

export default login;