// import { Service } from '../../lib/';
import OAuth from 'oauth';
import strformat from 'strformat';
import https from 'https';

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
	_performRequest() {

	},
	getData(req, res, next) {
		const widgetId = req.params.widgetId;
		const widget = req.body.widget;
		const userSource = req.body.user.settings.source;
		const raw = req.body;

		console.log(userSource);

		if (!widgetId || !widget) {
			return next({responseCode: 404, msg: 'widget id or settings is missing in the call'});
		}

		api._getSource(widget.version.source.name)
			.then(api._createOAuth)
			.then(oauth => {
				const baseUrl = widget.version.source.url;
				const apiPath = strformat(widget.version.server.requests.path, raw);
				const method = widget.version.server.requests.method;

				oauth[method](`${baseUrl}${apiPath}`, userSource.token, (err, result, response) => {
					if (err) {
						return next(err);
					}

					res.send(result);
				});
			})
			.catch(err => next(err));
	}
};

export default api;
