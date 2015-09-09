import { larchRead, LarchFS } from '../lib/';
import questions from './login.questions.es6';
import logger from './logger.es6';

// TODO: replace this with real login call, when user service is implemented
function loginAPI(user) {
	// let {username, password} = user;

	// TODO: remove this somewhere, where it makes more sense. REGISTRY URL has to be configurable in .larchrc
	const obj = {
		registryURL: 'https://localhost:9205',
		token: 1234567890
	};

	return Promise.resolve(obj);
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
			.then(LarchFS.save('./.larchrc'))
			.catch(err => {
				logger.error(err);
				process.exit(1);
			});
	}
};

export default login;