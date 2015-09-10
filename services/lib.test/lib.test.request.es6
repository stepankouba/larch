import restler from 'restler';
import fs from 'fs';

const Request = {
	create(type, url, conf) {
		const r = Object.create(Request.prototype);

		r.setConfiguration(type, url, conf);

		return r;
	},
	prototype: {
		/**
		 * set general request configuraiton
		 * @param {string} type GET, POST, PUT,...
		 * @param {string} url  request url
		 * @param {Object} conf configuration object stored in master.services.json
		 */
		setConfiguration(type, url, conf) {
			this.conf = {
				hostname: conf.url,
				protocol: conf.protocol,
				port: conf.port,
				path: url,
				method: type
			};
		},
		getFullUrl() {
			const o = this.conf;

			return `${o.protocol}//${o.hostname}:${o.port}${o.path}`;
		},

		setHeaders(conf) {
			this.conf.headers = conf;
		},
		/**
		 * perform a request
		 * @param  {Function} done standard jasmine done function
		 * @param  {Object}   conf optional conf
		 */
		request(done, conf = {json: true}) {
			const request = restler.request(this.getFullUrl(), {
				method: this.conf.method
			});

			request.on('complete', (data, res) => {
				res.setEncoding('utf8');
				if (res.statusCode === 200) {
					this.data = conf.json ? JSON.parse(data) : data;
				} else {
					this.error = {code: res.statusCode, data};
				}

				done();
			});

			request.on('error', (err,resp) => {
				this.error = err;
				done();
			});
		},
		requestMultipart(done, body, file) {
			/* eslint no-sync:false */
			const fstat = fs.statSync(file);

			restler.post(this.getFullUrl(), {
				multipart: true,
				data: {
					'data': JSON.stringify(body),
					'widget': restler.file(file, 'binary', fstat.size)
				}
			}).on('complete', (result, res) => {
				if (result instanceof Error) {
					this.error = result;
				} else {
					this.data = result;
				}

				done();
			});

		}
	}
};

export default Request;