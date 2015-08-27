import http from 'http';

const Request = {
	create(type, url, conf) {
		const r = Object.create(Request.prototype);

		r.setOptions(type, url, conf);

		return r;
	},
	prototype: {
		setOptions(type, url, conf) {
			this.options = {
				hostname: conf.url,
				port: conf.services.widgets.port,
				path: url,
				method: type
			};
		},
		request(done) {
			const request = http.request(this.options, res => {
				res.setEncoding('utf8');
				res.on('data', data => {
					if (res.statusCode === 200) {
						this.data = JSON.parse(data);
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
		}
	}
};

export default Request;