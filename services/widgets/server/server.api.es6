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
			.table('widgets')
			.filter({owner: userId})
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},

	getById: function(req, res, next) {
		let widgetId = parseInt(req.params.widgetId);

		if (!widgetId) {
			lib.paramErrorHandler(400,res, 'widgetId not specified');
		}

		r.db(conf.db.database)
			.table('widgets')
			.get(widgetId)
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},


};

module.exports = service;
