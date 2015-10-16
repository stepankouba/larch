// import { Service } from '../../lib/';
import OAuth from 'oauth';
import strformat from 'strformat';
import https from 'https';
import { transform, JSONParser } from 'larch.lib';

const api = {
	_getSource(name) {
		const options = {
			hostname: 'localhost',
			port: 9101,
			path: `/api/source/${name}`,
			rejectUnauthorized: false,
			method: 'GET'
		};

		return new Promise((resolve, reject) => {
			const req = https.request(options, res => {
				if (res.statusCode !== 200) {
					return reject(res);
				}

				res.on('data', data => resolve(JSON.parse(data)));
			});

			req.end();
			req.on('error', err => reject(err));
		});
	},
	_createOAuth(source) {
		const oauth = new OAuth.OAuth2(
			source.clientId,
			source.clientSecret,
			source.baseUrl,
			source.authorizePath,
			source.accessTokenPath,
			source.customHeaders
		);

		return Promise.resolve(oauth);
	},
	_performRequest(widget, token, apiPath) {
		return function _performRequest(oauth) {
			return new Promise((resolve, reject) => {
				const baseUrl = widget.version.source.url;
				const method = widget.version.server.requests.method;

				oauth[method](`${baseUrl}${apiPath}`, token, (err, result, response) => {
					if (err) {
						return reject(err);
					}

					resolve(JSON.parse(result));
				});
			});
		};
	},
	_transformData(widget) {
		return function _transformData(data) {
			return new Promise((resolve, reject) => {
				if (widget.version.transform) {
					const methods = JSONParser.evaluate(widget.version.transform.methods) || {};
					const template = widget.version.transform.template;

					if (!template) {
						reject({responseCode: 400, msg: 'missing template in transform'});
					}

					// console.log(transform(data, template, methods));
					resolve(transform(data, template, methods));
				} else {
					resolve(data);
				}
			});
		};
	},
	getData(req, res, next) {
		const widgetId = req.params.widgetId;
		const widget = req.body.widget;
		const token = req.body.security.token;
		const apiPath = strformat(widget.version.server.requests.path, req.body);

		if (!widgetId || !widget) {
			return next({responseCode: 404, msg: 'widget id or settings is missing in the call'});
		}

		api._getSource(widget.version.source.name)
			.then(api._createOAuth)
			.then(api._performRequest(widget, token, apiPath))
			.then(api._transformData(widget))
			.then(data => res.json(data))
			.catch(err => next(err));
	}
};

export default api;
