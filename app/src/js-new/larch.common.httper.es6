'use strict';

let HTTPerFn = function(Logger) {
	let logger = Logger.create('larch.HTTPer');

	let HTTPer = {
		get(url, callback) {
			let promise = new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();

				xhr.open("GET", url, true);
				
				xhr.onload = function (e) {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							resolve(xhr.responseText);
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

