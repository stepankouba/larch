'use strict';

let r = require('rethinkdbdash')();
let conf = require('../local.json');
let lib = require('../../lib/lib.server.es6');

let service = {
	getAll: function(req, res, next) {
		r.db(conf.db.database)
			.table('types')
			.filter({})
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},

	getById: function(req, res, next) {
		let typeId = parseInt(req.params.typeId);

		if (!typeId) {
			lib.paramErrorHandler(400,res, 'typeId not specified');
		}

		r.db(conf.db.database)
			.table('types')
			.get(typeId)
			.run()
			.then(result => {
				res.send(result);
			})
			.error(lib.rethinkErrorHandler(500, res));
	},


};

module.exports = service;
