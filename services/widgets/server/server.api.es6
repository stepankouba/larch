import RethinkDb from 'rethinkdbdash';

const r = RethinkDb();
const conf = require('../local.json');

const REGISRTY_PATH = `${__dirname}/../registry`;

const service = {
	getById(req, res, next) {
		if (!req.params.id) {
			return next(new Error('getById: id not specified'));
		}

		const ids = req.params.id.indexOf(',') > -1 ? req.params.id.split(',') : [req.params.id];

		r.db(conf.db.database)
			.table('widgets')
			.getAll(...ids)
			.run()
			.then(result => {
				res.send(result);
			})
			.error(err => next(err));
	},
	getByText(req, res, next) {
		if (!req.query.phrase) {
			return next(new Error('getByText: phrase not specified'));
		}

		// syntax: https://code.google.com/p/re2/wiki/Syntax
		const phrase = `(?i)(\b)?${req.query.phrase}(\b)?`;

		r.db(conf.db.database)
			.table('widgets')
			.filter(w => {
				return w('name').match(phrase) || w('title').match(phrase) || w('source')('name').match(phrase) ||
					w('desc').match(phrase);
			})
			.then(result => {
				res.send(result);
			})
			.error(err => next(err));
	},
	getAssetsById(req, res, next) {
		if (!req.params.name || !req.params.version || !req.params.asset) {
			return next(new Error('getAssetsById: name, version or asset not specified'));
		}

		const filename = `/${req.params.name}/${req.params.version}/${req.params.asset}`;

		const options = {
			root: REGISRTY_PATH,
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
	}
};

export default service;
