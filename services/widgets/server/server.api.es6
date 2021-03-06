import RethinkDb from 'rethinkdbdash';
import Registry from './server.registry.es6';
import { Service } from '../../lib/';

const r = RethinkDb();

const api = {
	/**
	 * return widget json by id (or by ids - String separated by comma)
	 * @param  {Object}   req  request object
	 * @param  {Object}   res  response object
	 * @param  {Function} next function
	 */
	getById(req, res, next) {
		const conf = Service.instance.conf;

		if (!req.params.id) {
			return next(new Error('getById: id not specified'));
		}

		// parse id param if containing ','
		// const ids = req.params.id.indexOf(',') > -1 ? req.params.id.split(',') : [req.params.id];
		const id = req.params.id;

		// request by getAll
		r.db(conf.db.database)
			.table('widgets')
			.get(id)
			.run()
			.then(result => {
				if (!null) {
					// ensure only latest version is returned (this might change in future)
					const ver = result.versions[0];
					result.version = ver;
					delete result.versions;

					res.json([result]);
				} else {
					res.json([]);
				}
			})
			.catch(err => next(err));
			// .finally(() => r.getPool().drain());
	},
	/**
	 * search by phrase, no AND OR support
	 * Phrase is searched in name, title, source.name and desc attributes
	 * @param  {Object}   req  request object
	 * @param  {Object}   res  response object
	 * @param  {Function} next function
	 */
	getByText(req, res, next) {
		if (!req.query.phrase) {
			return next(new Error('getByText: phrase not specified'));
		}
		const RESULTS_MAX = 10;
		const conf = Service.instance.conf;

		// syntax: https://code.google.com/p/re2/wiki/Syntax
		const phrase = `(?i)(\b)?${req.query.phrase}(\b)?`;

		r.db(conf.db.database)
			.table('widgets')
			.filter(w => {
				return w('name').match(phrase) || w('title').match(phrase) || w('desc').match(phrase) ||
					w('tags').toString().match(phrase);
			})
			.limit(RESULTS_MAX)
			.then(result => {
				res.json(result);
			})
			.catch(err => next(err));
			// .finally(() => r.getPool().drain());
	},
	/**
	 * get assets by name of the asset ('index.js, index.html')
	 * @param  {Object}   req  request object
	 * @param  {Object}   res  response object
	 * @param  {Function} next function
	 */
	getAssetsById(req, res, next) {
		if (!req.params.name || !req.params.version || !req.params.asset) {
			return next(new Error('getAssetsById: name, version or asset not specified'));
		}

		// construct path name
		const filename = `/${req.params.name}/${req.params.version}/${req.params.asset}`;

		const options = {
			root: Registry.REGISTRY_PATH,
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};

		// send file, if something happens, return error to next middleware, otherwise go to next middleware
		res.sendFile(filename, options, err => {
			if (err) {
				return next(err);
			} else {
				return next('route');
			}
		});
	},
	/**
	 * post widget function inserted from api.post.es6
	 */
	postWidget(req, res, next) {
		const widget = req.body;

		if (!widget) {
			return next({responseCode: 404, msg: 'widget definition missing in the request'});
		}

		Registry.postWidget(widget)
			.then(result => res.json(result))
			.catch(err => next(err));
	}

};

export default api;
