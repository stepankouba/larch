// import { Service } from '../../lib/';
import OAuth from 'oauth';
import strformat from 'strformat';

const api = {
	_getWidget(id) {
		const server = {
			params: {
				repo: 'text',
				owner: 'text'
			},
			requests: {
				path: '/repos/{params.owner}/{params.repo}/stats/commit_activity',
				method: 'get'
			}
		};

		const settings = {
			params: {
				repo: 'larch',
				owner: 'stepankouba'
			}
		};

		const widget = {
			name: 'github-commits',
			title: '...',
			source: {
				name: 'github',
				url: 'https://api.github.com',
				requests: server.requests,
				params: server.params
			},
			settings
		};

		return Promise.resolve(widget);
	},
	_getSource(id) {
		// get source object
		const Source = {
			clientId: 'd5954016069aaddfd1d6',
			clientSecret: '8ffeae9c39e4ecfd87503c0c5d9680e12e65e891',
			baseUrl: 'https://github.com',
			authorizePath: '/login/oauth/authorize',
			customHeaders: 'Accept: application/vnd.github.v3+json',
			accessTokenPath: '/login/oauth/access_token'
		};

		return Promise.resolve(Source);
	},
	_getUserSource(id) {
		const githubToken = '38687522b17c1f25c50f79e6f7eacfc5fa0c3bc7';

		return Promise.resolve({token: githubToken});
	},
	_createOAuth(Source) {
		const oauth = new OAuth.OAuth2(
			Source.clientId,
			Source.clientSecret,
			Source.baseUrl,
			Source.authorizePath,
			Source.accessTokenPath,
			Source.customHeaders
		);

		return Promise.resolve(oauth);
	},
	_performRequest() {

	},
	getData(req, res, next) {
		const widgetId = req.params.widgetId;
		let widget;
		let user;

		if (!widgetId) {
			return next({responseCode: 404, msg: 'widget id is missing in the call'});
		}

		api._getWidget(widgetId)
			.then(w => {
				widget = w;

				return Promise.resolve(w.source.id);
			})
			.then(api._getUserSource)
			.then(u => {
				user = u;

				return Promise.resolve(widget.source.id);
			})
			.then(api._getSource)
			.then(api._createOAuth)
			.then(oauth => {
				console.log(widget);
				console.log(user);

				const baseUrl = widget.source.url;
				const apiPath = strformat(widget.source.requests.path, widget.settings);
				const method = widget.source.requests.method;

				console.log(`${baseUrl}${apiPath}`);

				oauth[method](`${baseUrl}${apiPath}`, user.token, (err, result, response) => {
					if (err) {
						return next(err);
					}

					res.json(result);
				});
			})
			.catch(err => next(err));
	}
};

export default api;
