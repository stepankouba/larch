'use strict';

let HTTPerFn = function(Logger) {
	let logger = Logger.create('larch.HTTPer');

	let HTTPer = {
		get(url, conf = {}) {
			let promise = new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();

				xhr.open("GET", url, true);
				
				xhr.onload = function (e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							// if json set true, parse output as JSON, otherwise return plain textside
							resolve(conf.json ? JSON.parse(xhr.responseText) : xhr.responseText);
						} else {
							logger.error(xhr.statusText);
							reject(xhr.statusText);
						}
					}
				};
				
				xhr.onerror = function (e) {
					logger.error(xhr.statusText);
					reject(xhr.statusText);
				};
				
				xhr.send(null);
			});

			return promise;
		}
	};

	return HTTPer;
};

HTTPerFn.$injector = ['larch.Logger'];

export default HTTPerFn;

