import Cookies from '../lib/lib.cookies.es6';

const HTTPerFn = function(Logger) {
	const logger = Logger.create('larch.HTTPer');

	const HTTPer = {
		get(url, conf = {}) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const token = Cookies.getItem('larch.token');

				xhr.open('GET', url, true);

				if (token) {
					xhr.setRequestHeader('Authorization', `Bearer ${token}`);
				}

				xhr.onload = function(e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							// if json set true, parse output as JSON, otherwise return plain textside
							const r = conf.json ? JSON.parse(xhr.responseText) : xhr.responseText;

							resolve(r);
						} else {
							reject({
								statusCode: xhr.status,
								message: xhr.statusText,
								data: JSON.parse(xhr.responseText)
							});
						}
					}
				};

				xhr.onerror = function(e) {
					logger.error(xhr.statusText);
					reject(e);
				};

				xhr.send(null);
			});
		},
		post(url, data, conf = {}) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const stringifiedData = JSON.stringify(data);
				const token = Cookies.getItem('larch.token');

				xhr.open('POST', url, true);

				if (token) {
					xhr.setRequestHeader('Authorization', `Bearer ${token}`);
				}

				// Send the proper header information along with the request
				xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

				xhr.onload = function(e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							// if json set true, parse output as JSON, otherwise return plain textside
							const r = conf.json ? JSON.parse(xhr.responseText) : xhr.responseText;

							resolve(r);
						} else {
							reject({
								statusCode: xhr.status,
								message: xhr.statusText,
								data: JSON.parse(xhr.responseText)
							});
						}
					}
				};

				xhr.onerror = function(e) {
					logger.error(xhr.statusText);
					reject(e);
				};

				xhr.send(stringifiedData);
			});
		}
	};

	return HTTPer;
};

HTTPerFn.$injector = ['larch.Logger'];

export default HTTPerFn;

