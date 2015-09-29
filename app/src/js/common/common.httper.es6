const HTTPerFn = function(Logger) {
	const logger = Logger.create('larch.HTTPer');

	const HTTPer = {
		get(url, conf = {}) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.open('GET', url, true);

				xhr.onload = function(e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							// if json set true, parse output as JSON, otherwise return plain textside
							const r = conf.json ? JSON.parse(xhr.responseText) : xhr.responseText;

							resolve(r);
						} else {
							logger.error(xhr.statusText);
							reject({statusCode: xhr.status, message: xhr.statusText});
						}
					}
				};

				xhr.onerror = function(e) {
					logger.error(xhr.statusText);
					reject(xhr.statusText);
				};

				xhr.send(null);
			});
		},
		post(url, data, conf = {}) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				const stringifiedData = JSON.stringify(data);

				xhr.open('POST', url, true);

				// Send the proper header information along with the request
				xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');

				xhr.onload = function(e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							// if json set true, parse output as JSON, otherwise return plain textside
							const r = conf.json ? JSON.parse(xhr.responseText) : xhr.responseText;

							resolve(r);
						} else {
							logger.error(xhr.statusText);
							reject({statusCode: xhr.status, message: xhr.statusText});
						}
					}
				};

				xhr.onerror = function(e) {
					logger.error(xhr.statusText);
					reject(xhr.statusText);
				};

				xhr.send(stringifiedData);
			});
		}
	};

	return HTTPer;
};

HTTPerFn.$injector = ['larch.Logger'];

export default HTTPerFn;

