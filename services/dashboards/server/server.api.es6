import { Service } from '../../lib/';
import RethinkDB from 'rethinkdbdash';

const api = {
	getDashboard(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const id = req.params.id;
		const r = RethinkDB();

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
		const r = RethinkDB();

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
	},
	saveDashboard(req, res, next) {
		const ds = req.body;
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const r = RethinkDB();

		/**
		 * testing, whether sent
		 * @param  {Object}  ds Dashboard object
		 * @return {Boolean}    true if all fields are in
		 */
		function hasAllRequired(ds) {
			const fields = ['desc', 'like', 'name', 'owner', 'shared', 'layout', 'widgets'];
			let result = true;

			Object.keys(fields).forEach(field => {
				if (!(field in ds)) {
					logger.error(`${field} is missing in the reques`);
					result = false;
				}
			});

			return result;
		}

		if (!ds && !hasAllRequired(ds)) {
			return next({responseCode: 404, msg: 'dashboard is not properly defined'});
		}
		logger.error('this is insert');
		// insert and if same name exists, return error
		r.db(conf.db.database)
			.table('dashboards')
			.insert(
				r.db(conf.db.database)
				.table('dashboards')
				.filter({
					owner: ds.owner,
					name: ds.name
				})
				.coerceTo('array')
				.do(docs => {
					return r.branch(docs.count().eq(0),
						ds,
						r.error('SAME_NAME_EXISTS')
						);
				})
			)
			.run()
			.then(result => res.json({responseCode: 200, msg: 'inserted', data: result}))
			.catch(err => {
				if (/SAME_NAME_EXISTS/g.test(err)) {
					return next({responseCode: 409, msg: 'SAME_NAME_EXISTS'});
				} else {
					return next(err);
				}
			});
	}
};

export default api;
