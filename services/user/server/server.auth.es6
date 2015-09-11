import RethinkDb from 'rethinkdbdash';
import { Service } from '../../lib/';
import crypto from 'crypto';

const r = RethinkDb();
const LENGTH = 512;

const Auth = {
	/**
	 * get user from DB by username
	 * @param  {string} username username
	 * @param  {string} pass     password
	 * @return {Promise.<Array|Error>}  resolve array of [user oobject, password to be checked]
	 */
	_getByName(username, pass) {
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('users')
				.filter({username, available: true})
				.run()
				.then(res => {
					if (res.length > 0) {
						return resolve([res[0], pass]);
					} else {
						return reject(false);
					}
				})
				.catch(err => reject(err));
		});
	},
	/**
	 * generate salt based on length
	 * @return {string} salt
	 */
	getSalt() {
		return crypto.randomBytes(LENGTH).toString('hex');
	},
	/**
	 * generate random number of iterations betwee 8000 - 12000
	 * @return {number} number of iterations
	 */
	getIterations() {
		const LOW = 8000;
		const HIGH = 12000;

		return Math.random() * (HIGH - LOW) + LOW;
	},
	/**
	 * create hash for a password
	 * @param  {Array[]} data provided data
	 * @param  {Object} data[] user object
	 * @param  {string} data[] password to be hashed
	 * @return {Promise.<Array|Error>} resolves user object and hash
	 */
	hash(data) {
		const [user, pass] = data;

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(pass, user.login.salt, user.login.iterations, LENGTH, 'sha256',
				(err, key) => {
					if (err) {
						return reject(err);
					}

					return resolve([user, key.toString('hex')]);
				}
			);
		});
	},
	/**
	 * perform login operation
	 * @param  {string} name username
	 * @param  {string} pass password
	 * @return {Promise} promise to be handled later on
	 */
	login(name, pass) {
		return this._getByName(name, pass)
			.then(this.hash)
			.then(data => {
				const [user, hash] = data;

				if (user.password === hash) {
					delete user.login;
					delete user.password;

					const token = Service.Auth.createToken(user);

					return Promise.resolve({user, token});
				} else {
					return Promise.reject(false);
				}
			});
	}
};

export default Auth;