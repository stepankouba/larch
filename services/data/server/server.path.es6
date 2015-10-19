import strformat from 'strformat';
import { transform } from 'larch.lib';

const Path = {
	/**
	 * ensure always array is passed to be processed
	 * @param  {Object|Array} requests object or array of requests
	 * @return {Array}
	 */
	_checkRequests(requests) {
		if (!Array.isArray(requests)) {
			requests = [requests];
		}

		return requests;
	},
	/**
	 * [_resolveRequest description]
	 * @param  {Object} request      containing info about request from widget
	 * @param  {[type]} baseUrl      [description]
	 * @param  {[type]} oauth        [description]
	 * @param  {[type]} pathSettings [description]
	 * @return {[type]}              [description]
	 */
	_resolveRequest(request, token, baseUrl, oauth, pathSettings) {
		return function _resolveRequest(response) {
			return new Promise((resolve, reject) => {
				// do not allow path as array
				if (Array.isArray(request.path)) {
					return reject('can not proceed with Array as path');
				}

				const pathType = typeof request.path;
				const method = request.method;
				const settings = Object.assign({}, pathSettings);

				// in case of response from previous request
				if (response) {
					// so we can use it in our path
					settings.response = response;

					// if we have to filter reponse somehow (path.filterResponse attribute)
					if (pathType === 'object' && request.path.filterResponse) {
						// even filter may contain strformat
						const filter = strformat(request.path.filterResponse, settings);
						settings.filtered = transform(response, filter);
					}
				}

				let url = (pathType === 'string') ? `${baseUrl}${request.path}` : request.path.url;
				url = strformat(url, settings);

				// do request
				oauth[method](`${url}`, token, (err, result, response) => {
					if (err) {
						return reject(err);
					}

					return resolve(JSON.parse(result));
				});
			});
		};
	},
	perform(widget, token, oauth, pathSettings) {
		const r = Path._checkRequests(widget.version.server.requests);
		const baseUrl = widget.version.source.url;

		return r.reduce((p, request) => p.then(Path._resolveRequest(request, token, baseUrl, oauth, pathSettings)),
			Promise.resolve(undefined));
	}
};

export default Path;