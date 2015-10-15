import Cookies from '../lib/lib.cookies.es6';

const HTTPerFn = function(Logger) {
	const logger = Logger.create('larch.HTTPer');

	const HTTPClass = {
		create(method, conf) {
			const h = Object.create(HTTPClass.prototype);
			h.method = method;

			h.xhr = new XMLHttpRequest();
			h.conf = conf;
			
			return h;
		},
		prototype: {
			/**
			 * [open description]
			 * @param  {String} url     [description]
			 * @param  {Function} resolve [description]
			 * @param  {Function} reject  [description]
			 */
			open(url, resolve, reject) {
				const token = Cookies.getItem('larch.token');

				this.url = url;
				this.xhr.open(this.method, url, true);

				if (token) {
					this.xhr.setRequestHeader('Authorization', `Bearer ${token}`);
				}

				this.resolve = resolve;
				this.reject = reject;
			},
			onload(cb = undefined) {
				if (cb) {
					this.xhr.onload = cb;
				} else {
					this.xhr.onload = e => {

						if (this.xhr.readyState === 4) {
							if (this.xhr.status === 200) {
								// if json set true, parse output as JSON, otherwise return plain textside
								const r = this.conf.json ? JSON.parse(this.xhr.responseText) : this.xhr.responseText;
								this.resolve(r);
							} else if (this.xhr.status === 401) {
								// unauthorized access to the API
								// window.location = 'login.html';
								logger.error(`unauthorized access to ${this.url}`);
							} else {
								this.reject({
									statusCode: this.xhr.status,
									message: this.xhr.statusText,
									data: JSON.parse(this.xhr.responseText)
								});
							}
						}
					};
				}
			},
			onerror(cb = undefined) {
				if (!cb) {
					this.xhr.onerror = function onerror(e) {
						logger.error(this.xhr.statusText);
						return this.reject(e);
					};
				} else {
					this.xhr.onerror = cb;
				}
			},
			/**
			 * [send description]
			 * @param  {String} data  stringified data
			 */
			send(data = null) {
				if (data) {
					this.xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
				}

				this.xhr.send(data);
			}
		}

	};

	const HTTPer = {
		get(url, conf = {}) {
			return new Promise((resolve, reject) => {
				const r = HTTPClass.create('GET', conf);
				r.open(url, resolve, reject);
				// default on error handlers
				r.onerror();
				r.onload();

				r.send();
			});
		},
		post(url, data, conf = {}) {
			return new Promise((resolve, reject) => {
				const stringifiedData = JSON.stringify(data);
				const r = HTTPClass.create('POST', conf);
				r.open(url, resolve, reject);

				// default on error handlers
				r.onerror();
				r.onload();

				r.send(stringifiedData);
			});
		},
		delete(url, conf = {}) {
			return new Promise((resolve, reject) => {
				const r = HTTPClass.create('DELETE', conf);
				r.open(url, resolve, reject);

				// default on error handlers
				r.onerror();
				r.onload();

				r.send();
			});
		},
		put(url, data, conf = {}) {
			return new Promise((resolve, reject) => {
				const stringifiedData = JSON.stringify(data);
				const r = HTTPClass.create('PUT', conf);
				r.open(url, resolve, reject);

				// default on error handlers
				r.onerror();
				r.onload();

				r.send(stringifiedData);
			});
		}
	};

	return HTTPer;
};

HTTPerFn.$injector = ['larch.Logger'];

export default HTTPerFn;

