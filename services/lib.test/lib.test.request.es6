import http from 'http';
import rest from 'restler';

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
		setHeaders(conf) {
			this.conf.headers = conf;
		},
		/**
		 * perform a request
		 * @param  {Function} done standard jasmine done function
		 * @param  {Object}   conf optional conf
		 */
		request(done, conf = {json: true}) {
			const request = http.request(this.conf, res => {
				res.setEncoding('utf8');
				res.on('data', data => {
					if (res.statusCode === 200) {
						this.data = conf.json ? JSON.parse(data) : data;
					} else {
						this.error = {code: res.statusCode, data};
					}

					done();
				});
			});

			request.on('error', err => {
				this.error = err;
				done();
			});

			request.end();
		},
		requestMultipart(done, body, files) {
			const o = this.conf;

			rest.post(`${o.protocol}//${o.hostname}:${o.port}${o.path}`, {
				multipart: true,
				data: {
					'data': JSON.stringify(body),
					'widget': rest.file('test.tar.gz', 'binary', 3034)
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