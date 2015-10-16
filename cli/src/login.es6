import { larchRead, LarchFS } from '../lib/';
import questions from './login.questions.es6';
import logger from './logger.es6';
import restler from 'restler';

// TODO: replace this with real login call, when user service is implemented
function loginAPI(user) {
	const API_URL = 'https://localhost:9101/api';
	const {username, password} = user;

	return new Promise((resolve, reject) => {
		restler.get(`https://localhost:9101/api/user/login?username=${username}&password=${password}`)
			.on('complete', (result, res) => {
				if (result instanceof Error || res.statusCode > 399) {
					return reject(`can not log in (reason: ${result.msg})`);
				}

				return resolve({api: API_URL, token: result.token});
			});
	});
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