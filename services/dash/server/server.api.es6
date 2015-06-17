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
		let dashId = parseInt(req.params.dashId);

		if (!dashId) {
			lib.paramErrorHandler(400,res, 'dashId not specified');
		}

		r.db(conf.db.database)
			.table('dashboards')
			.get(dashId)
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},


};

module.exports = service;
