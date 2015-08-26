import RethinkDb from 'rethinkdbdash';

const r = RethinkDb();
const conf = require('../local.json');

const service = {
	getAll(req, res, next) {
		const userId = parseInt(req.params.userId, 10);

		if (!userId) {
			return next(new Error('userId is not specified'));
		}

		r.db(conf.db.database)
			.table('widgets')
			.filter({owner: userId})
			.run()
			.then(result => {
				res.send(result);
			})
			.error(err => next(err));
	},
	getById(req, res, next) {
		const widgetId = parseInt(req.params.widgetId, 10);

		if (!widgetId) {
			return next(new Error('widgetId not specified'));
		}

		r.db(conf.db.database)
			.table('widgets')
			.get(widgetId)
			.run()
			.then(result => {
				res.send(result);
			})
			.error(err => next(err));
	}
};

export default service;
