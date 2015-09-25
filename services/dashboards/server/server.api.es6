import { Service } from '../../lib/';
import RethinkDB from 'rethinkdbdash';

const r = RethinkDB();

const api = {
	getDashboard(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const id = req.params.id;

		logger.info(`requesting dashboard.id = ${id}`);

		if (!id) {
			return next({responseCode: 404, msg: 'dashboard id not specified'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.get(id)
			.run()
			.then(dashboard => res.json(dashboard))
			.catch(err => next(err));
	},
	getMyDashboards(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const user = req.params.user;

		logger.info(`requesting all dashboards for user ${user}`);

		if (!user) {
			return next({responseCode: 404, msg: 'user is not specified'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.filter({owner: user})
			.run()
			.then(dashboards => res.json(dashboards))
			.catch(err => next(err));
	}
};

export default api;
