import * as LarchFS from './lib.fs.es6';
import restler from 'restler';
import fs from 'fs';
// import path from 'path';

const REGISTRY = 'https://localhost:9101/api';

const LarchRegistry = {
	/**
	 * array of errors filled in by _testConf
	 * @type {Array}
	 */
	errors: [],
	/**
	 * URL for registry. If not set used REGISTRY const
	 * @type {string}
	 */
	registryURL: REGISTRY,

	/**
	 * check configuration
	 * @param  {Object} conf      configuration to be checked
	 * @param  {Object} validator definition of validation rules
	 * @private
	 */
	_testConf(conf, validator) {
		for (const key in conf) {
			if (typeof validator[key] === 'object') {
				this._testConf(conf[key], validator[key]);
			} else if (validator[key]) {
				// perform test
				const testResult = validator[key](conf[key]);

				if (typeof testResult === 'object') {
					this.errors.push(`${key}: ${testResult.message}`);
				}

			}// else
		}// for
	},
	loadIndex(dir) {
		/*eslint no-sync:0*/
		const fileContent = fs.readFileSync(`${dir}/index.es6`, 'utf8');
		/*eslint no-eval:0*/
		return eval(`(function(){ ${fileContent} \n return widget;})()`);
	},
	/**
	 * Promisification of _testConf method
	 * @param  {Object} conf      configuration to be checked
	 * @param  {Object} validator definition of validation rules
	 * @public
	 */
	testConf(conf, validator, rc = {}) {
		this.errors = [];

		return new Promise((resolve, reject) => {
			this._testConf(conf,validator);

			if (this.errors.length === 0) {
				resolve([conf, rc]);
			} else {
				reject(this.errors);
			}

		});
	},
	/**
	 * create tar.gz file from package directory via LarchFS.createGzip method
	 * @param  {string} dir directory location
	 * @return {Prmise.<string|Error>} returns targz file name via Promise.resolve
	 */
	createGzip(dir) {
		return () => {
			return LarchFS.createGzip(dir);
		};
	},
	/**
	 * post data via multipart post request to the registry server
	 * @param  {Object} conf  package.json configuration with widget definition
	 * @param  {string} token auth token created by login command and stored in larchrc.json
	 * @return {Promise.<Object|Error>}		 result of request
	 */
	// postToServer(conf, token) {
	// 	return function _postToSever(fileName) {
	// 		return new Promise((resolve, reject) => {
	// 			fs.stat(path.resolve(fileName), (err, stat) => {
	// 				if (err) {
	// 					reject(err);
	// 				}

	// 				restler.post(`${this.registryURL}/widget`, {
	// 					multipart: true,
	// 					accessToken: token,
	// 					data: {
	// 						'data': JSON.stringify(conf),
	// 						'widget': restler.file(fileName, 'utf8', stat.size)
	// 					}
	// 				}).on('complete', (result, res) => {
	// 					if (result instanceof Error || res.statusCode > 399) {
	// 						return reject(result);
	// 					}
	// 					return resolve(result);
	// 				}); // post
	// 			});// stat
	// 		});// promise
	// 	}.bind(LarchRegistry);
	// }

	postToServer([widget, rc]) {
		return new Promise((resolve, reject) => {
			restler.postJson(`${REGISTRY}/widget`, widget, {accessToken: rc.token})
				.on('complete', (result, res) => {
					if (result instanceof Error || res.statusCode > 399) {
						return reject(result);
					}

					return resolve(result);
				});
		});
	}
};

export default LarchRegistry;