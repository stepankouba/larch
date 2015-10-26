import { Service } from '../../lib/';
import RethinkDb from 'rethinkdbdash';

const r = RethinkDb();

const api = {
	getDashboard(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const id = req.params.id;

		logger.info(`requesting dashboard.id = ${id}`);

		if (!id) {
			return next({responseCode: 404, msg: 'GET_DS_NO_ID_ERR'});
		}

		r.branch(
				r.db(conf.db.database)
						.table('dashboards')
						.get(id)
					.hasFields('originId'),
				r.db(conf.db.database)
						.table('dashboards')
						.getAll(id)
					.eqJoin('originId', r.db(conf.db.database).table('dashboards'))
					.without({right: 'id'})
					.zip(),
				r.db(conf.db.database)
						.table('dashboards')
						.get(id)
			)
			.run()
			.then(dashboard => res.json(dashboard))
			.catch(err => next(err));
	},
	getPublicDashboard(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const id = req.params.id;

		logger.info(`requesting public dashboard.id = ${id}`);

		if (!id) {
			return next({responseCode: 404, msg: 'GET_DS_NO_ID_ERR'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.filter({id, shared: 'public'})
			.run()
			.then(dashboard => res.json(dashboard.length ? dashboard[0] : {}))
			.catch(err => next(err));
	},
	getMyDashboards(req, res, next) {
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		const user = req.params.user;

		logger.info(`requesting all dashboards for user ${user}`);

		if (!user || user !== req.user.username) {
			return next({responseCode: 404, msg: 'GET_DS_NO_USER_ERR'});
		}

		// union both my dashboards and those, created based on shared
		r.db(conf.db.database)
			.table('dashboards')
			.filter(
				r.and(
					r.row('owner').eq(user),
					r.row.hasFields('originId').not()
				)
			).union(
				r.db(conf.db.database)
					.table('dashboards')
					.filter({owner: user})
					.eqJoin('originId', r.db(conf.db.database).table('dashboards'))
					.without({right: 'id'})
					.zip()
			).run()
			.then(dashboards => res.json(dashboards))
			.catch(err => next(err));
	},
	remove(req, res, next) {
		const id = req.params.id;
		const conf = Service.instance.conf;
		const owner = req.user.username;

		if (!id || !owner) {
			return next({responseCode: 404, msg: 'REMOVE_NO_ID_ERR'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.filter({id, owner})
			.delete()
			.run()
			.then(result => {
				if (result.deleted === 1) {
					return res.json({msg: 'deleted'});
				} else {
					return res.json({responseCode: 409, msg: 'REMOVE_NOT_OWNER_ERR'});
				}
			})
			.catch(err => next(err));
	},
	updateDashboard(req, res, next) {
		const ds = req.body;
		const conf = Service.instance.conf;
		const id = req.params.id;

		if (ds.id) {
			delete ds.id;
		}

		if (!id) {
			return next({responseCode: 404, msg: 'UPDATE_MISSING_ID_ERR'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.get(id)
			.update(ds, {returnChanges: true})
			.run()
			.then(result => res.json(result.changes[0].new_val))
			.catch(err => next(err));
	},
	saveFromShared(req, res, next) {
		const originUrl = req.body.url;
		const re = /^https:\/\/anylarch.com\/public\/(.*)$/i;
		const conf = Service.instance.conf;

		// pars url
		const m = originUrl.match(re);
		const originId = m ? m[1] : undefined;

		if (!originId) {
			return next({responseCode: 404, msg: 'INVALID_PUBLIC_ID_ERR'});
		}

		r.db(conf.db.database)
			.table('dashboards')
			.get(originId)
			.run()
			.then(originDS => {
				if (!originDS || originDS.shared === false) {
					return next({responseCode: 404, msg: 'INVALID_PUBLIC_ID_ERR'});
				}

				const ds = {
					originId: originDS.id,
					owner: req.user.username,
					fromShared: true
				};

				r.db(conf.db.database)
					.table('dashboards')
					.insert(ds, {returnChanges: true})
					.run()
					.then(result => res.json({responseCode: 200, msg: 'GENERAL_RESULT_OK', data: result}))
					.catch(err => next(err));
			})
			.catch(err => next(err));
	},
	saveDashboard(req, res, next) {
		const ds = req.body;
		const logger = Service.instance.server.logger;
		const conf = Service.instance.conf;
		ds.owner = req.user.username;

		if (ds.originId) {
			return next({responseCode: 404, msg: 'UPDATE_FROM_SHARED_ERR'});
		}

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
			return next({responseCode: 404, msg: 'UPDATE_MISSING_FIELDS_ERR'});
		}

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
				}),
				{returnChanges: true}
			)
			.run()
			.then(result => res.json({responseCode: 200, msg: 'GENERAL_RESULT_OK', data: result}))
			.catch(err => {
				if (/SAME_NAME_EXISTS/g.test(err)) {
					return next({responseCode: 409, msg: 'SAME_NAME_EXISTS_ERR'});
				} else {
					return next(err);
				}
			});
			// .finally(() => r.getPool().drain());
	}
};

export default api;
