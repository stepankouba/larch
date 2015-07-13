'use strict';

let r = require('rethinkdbdash')();
let conf = require('../local.json');
let lib = require('../../lib/lib.server.es6');

let service = {
	getAll: function(req, res, next) {
		let userId = parseInt(req.params.userId);

		if (!userId) {
			lib.paramErrorHandler(400, res, 'userId not specified');
		}

		r.db(conf.db.database)
			.table('dashboards')
			.filter({owner: userId})
			.orderBy('id')
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},

	getById: function(req, res, next) {
		let dashId = req.url.endsWith('home') ? 'home' : parseInt(req.params.dashId);
		let query;

		if (!dashId) {
			lib.paramErrorHandler(400,res, 'dashId not specified' + req.url);
		}

		// this handle special case, when asking for home dashboard
		if (dashId === 'home') {
			query = r.db(conf.db.database)
				.table('dashboards')
				.filter({home: true})
				.limit(1);
		} else {
			query = r.db(conf.db.database)
				.table('dashboards')
				.get(dashId);
		}
		
		query.run()
			.then(result => {
				// this handles the case, when system asks for home dashboard and thanks to filter, array is returned
				res.send(Array.isArray(result) ? result[0] : result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},


};

module.exports = service;
