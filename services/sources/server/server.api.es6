import { Service } from '../../lib/';
import RethinkDB from 'rethinkdbdash';

const r = RethinkDB();

const api = {
	getSource(req, res, next) {
		const name = req.params.name;
		const conf = Service.instance.conf;

		if (!name) {
			return next({responseCode: 404, msg: 'name is missing in the call'});
		}

		r.db(conf.db.database)
			.table('sources')
			.filter({name})
			.run()
			.then(result => res.json(result))
			.catch(err => next(err));
	}
};

export default api;
