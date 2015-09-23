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
							resolve(conf.json ? JSON.parse(xhr.responseText) : xhr.responseText);
						} else {
							logger.error(xhr.statusText);
							reject(xhr.statusText);
						}
					}
				};

				xhr.onerror = function(e) {
					logger.error(xhr.statusText);
					reject(xhr.statusText);
				};

				xhr.send(null);
			});
		}
	};

	return HTTPer;
};

HTTPerFn.$injector = ['larch.Logger'];

export default HTTPerFn;

