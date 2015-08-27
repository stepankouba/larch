import RethinkDb from 'rethinkdbdash';

const r = RethinkDb();
const conf = require('../local.json');

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
	}
};

export default service;
