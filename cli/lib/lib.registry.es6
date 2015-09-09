import * as LarchFS from './lib.fs.es6';
import restler from 'restler';
import fs from 'fs';

const REGISTRY = 'https://localhost:9205/widget';

const LarchRegistry = {
	errors: [],
	_testConf(conf, validator) {
		for (const key in conf) {
			if (typeof validator[key] === 'object') {
				this._testConf(conf[key], validator[key]);
			} else {
				// perform test
				const testResult = validator[key](conf[key]);

				if (typeof testResult === 'object') {
					this.errors.push(`${key}: ${testResult.message}`);
				}

			}// else
		}// for
	},
	testConf(conf, validator) {
		this.errors = [];

		return new Promise((resolve, reject) => {
			this._testConf(conf,validator);

			if (this.errors.length === 0) {
				resolve(true);
			} else {
				reject(this.errors);
			}

		});
	},
	createGzip(conf) {
		return () => {
			LarchFS.createGzip();
		};
	},
	postToServer(conf, token) {
		return function _postToSever(tarGzipFileName) {
			return new Promise((resolve, reject) => {
				fs.stat(tarGzipFileName, (err, stat) => {
					if (err) {
						reject(err);
					}

					restler.post(`test url`, {
						multipart: true,
						data: {
							'data': JSON.stringify(conf),
							'widget': rest.file(tarGzipFileName, 'binary', stat.size)
						}
					}).on('complete', (result, res) => {
						if (result instanceof Error) {
							return reject(result);
						}

						return resolve(result);
					}); // post
				});// stat
			});// promise
		}
	}
};

export default LarchRegistry;