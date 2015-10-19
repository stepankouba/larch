// import { Service } from '../../lib/';
import OAuth from 'oauth';
import https from 'https';
import { transform, JSONParser } from 'larch.lib';
import Path from './server.path.es6';

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
	/**
	 * [_performRequests description]
	 * @param  {Object} widget            [description]
	 * @param  {String} token             [description]
	 * @param  {[type]} strFormatSettings [description]
	 * @return {[type]}                   [description]
	 */
	_performRequests(widget, token, strFormatSettings) {
		return function _performRequests(oauth) {
			return Path.perform(widget, token, oauth, strFormatSettings);
		};
	},
	_transformData(widget) {
		return function _transformData(data) {
			return new Promise((resolve, reject) => {
				if (widget.version.transform) {
					const methods = widget.version.transform.methods ? JSONParser.evaluate(widget.version.transform.methods) : {};
					const template = widget.version.transform.template;

					if (!template) {
						return reject({responseCode: 400, msg: 'missing template in transform'});
					}

					// console.log(transform(data, template, methods));
					return resolve(transform(data, template, methods));
				} else {
					return resolve(data);
				}
			});
		};
	},
	getData(req, res, next) {
		const widgetId = req.params.widgetId;
		const widget = req.body.widget;
		const token = req.body.security.token;

		if (!widgetId || !widget) {
			return next({responseCode: 404, msg: 'widget id or settings is missing in the call'});
		}

		api._getSource(widget.version.source.name)
			.then(api._createOAuth)
			.then(api._performRequests(widget, token, { settings: req.body.settings }))
			.then(api._transformData(widget))
			.then(data => res.json(data))
			.catch(err => next(err));
	}
};

export default api;
