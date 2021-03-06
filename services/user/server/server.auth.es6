import RethinkDb from 'rethinkdbdash';
import { Service } from '../../lib/';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const LENGTH = 512;
// twenty minutes
const HASH_VALIDITY = 20 * 60 * 60;

const r = RethinkDb();

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
			// .finally(() => r.getPool().drain());
		});
	},
	/**
	 * generate salt based on length
	 * @param {Number} l length of the salt, default is LENGTH
	 * @return {string} salt
	 */
	getSalt(l = LENGTH) {
		return crypto.randomBytes(l).toString('hex');
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
	 * create a user and token insert in the database
	 * @param  {Object} user user's object
	 * @return {Promise.<Object|Error>}
	 */
	createUserAndToken(user) {
		const token = Service.Auth.createToken(user);
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('tokens')
				.insert({username: user.username, token, createdAt: new Date()})
				.run()
				.then(res => resolve({user, token}))
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	_checkPassword(data) {
		return new Promise((resolve, reject) => {
			const [user, hashedPass] = data;

			if (user.password === hashedPass) {
				delete user.login;
				delete user.password;

				return resolve(user);
			} else {
				return reject(false);
			}

		});
	},
	_updateLastLogin(user) {
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('users')
				.get(user.id)
				.update({lastLogin: new Date()})
				.run()
				.then(res => resolve(user))
				.catch(err => reject(err));
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
			.then(this._checkPassword)
			.then(this._updateLastLogin)
			.then(this.createUserAndToken);
	},
	/**
	 * logout method
	 * @param  {string} username just a username
	 * @param  {string} token 	just a token
	 * @return {Promise.<boolean|Error>}
	 */
	logout(username, token) {
		const conf = Service.instance.conf;

		console.log(username, token);

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('tokens')
				.filter({username, token})
				.delete()
				.run()
				.then(res => resolve(true))
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	/**
	 * store user's data in database
	 * @param  {Array} data
	 * @param  {Object} data[0] user's object
	 * @param  {string} data[1] user's hashed password
	 * @return {Promise.<Object|Error>} users object returned in case of resolve
	 */
	_saveUser(data) {
		const conf = Service.instance.conf;
		const [user, password] = data;

		user.password = password;
		user.createdAt = new Date();
		// added empty array for future sources accounts
		user.sources = [];
		// add default settings
		user.settings = {
			allowEmails: true
		};

		return new Promise((resolve, reject) => {
			r.branch(
				r.db(conf.db.database)
					.table('users')
					.filter({username: user.username})
					.count().eq(0),
				r.db(conf.db.database)
					.table('users')
					.insert(user, {returnChanges: true}),
				r.error('existing user')
			).run()
				.then(result => {
					const user = result.changes[0].new_val;
					delete user.login;
					delete user.password;

					return resolve(user);
				})
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	/**
	 * mock method for email sending - HAS to BE UPDATED, when known how to solve it
	 * @param  {Object} user user object
	 * @return {Promise.<Object>} pass user object
	 */
	_sendEmail(user) {
		const logger = Service.instance.server.logger;

		// create reusable transporter object using SMTP transport
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'stepan@anylarch.com',
				pass: 'aKvV2hRB2DDjPF'
			}
		});

		const text = [
			'Hello,',
			`We\'re really glad you\'ve chosen www.anylarch.com. The only tool you need for sharing your view. Your e-mail address and username logging in is ${user.username}`,
			'',
			`You can start using the app immediately: www.anylarch.com/app`,
			'',
			'I hope, you have a wonderful time with anylarch. If you have any questions or comments, feel free to write to us at support@anylarch.com',
			'',
			`Thanks and enjoy the app.`,
			'',
			`Stepan`,
			'Founder of anylarch.com'
		].join('\n');

		// setup e-mail data with unicode symbols
		const mailOptions = {
			from: 'Stepan Kouba <stepan@anylarch.com>', // sender address
			to: user.username, // list of receivers
			subject: 'Welcome to www.anylarch.com', // Subject line
			text // plaintext body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return logger.error(error);
			}

			logger.debug(`Message sent: ${info.response}`);
		});

		return Promise.resolve(user);
	},

	/**
	 * create new user based on provided data
	 * @param  {Object} user user object
	 * @param  {string} user.name user's name 'Stepan Kouba'
	 * @param  {string} user.username user's email 'stepan.kouba@test.com'
	 * @param  {string} user.password user's password ''
	 * @return {[type]}      [description]
	 */
	signin(user) {
		const password = user.password;
		delete user.password;

		user.available = true;
		user.login = {
			salt: this.getSalt(),
			iterations: this.getIterations(),
			// hashForConfirmation: crypto.randomBytes(25).toString('hex'),
			// hashValidity: Date.now() + HASH_VALIDITY
		};
		// store the information about help
		user.showHelp = 'basic';

		return this.hash([user, password])
			.then(this._saveUser)
			.then(this._sendEmail)
			.then(this.createUserAndToken);
	},
	/**
	 * check the password
	 * - Contain at least 6 characters
	 * - contain at least 1 number
	 * - contain at least 1 lowercase character (a-z)
	 * - contain at least 1 uppercase character (A-Z)
	 * - contains only 0-9a-zA-Z
	 * @param  {[type]}  pass [description]
	 * @return {Boolean}      [description]
	 */
	isPassword(pass) {
		return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(pass);
	},
	_searchForHash(hash, password) {
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('users')
				.filter(d => {
					return d('available').eq(false)
						.and(d('login')('hashForConfirmation').eq(hash))
						.and(d('login')('hashValidity').gt(Date.now()))
						;
				})
				.run()
				.then(result => {
					if (result.length > 0) {
						resolve([result[0], password]);
					} else {
						reject(false);
					}
					// console.log(result[0]);
					// resolve([result[0], password]);
				})
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	_updateAvailable(user) {
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('users')
				.get(user.id)
				.update({available: true})
				.run()
				.then(result => resolve(user))
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	confirm(hash, password) {
		// filter with available, validity, hash
		return this._searchForHash(hash, password)
			.then(this.hash)
			.then(this._checkPassword)
			.then(this._updateAvailable)
			.then(this.createUserAndToken);
	}
};

export default Auth;