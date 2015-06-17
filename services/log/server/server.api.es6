'use strict';

let r = require('rethinkdbdash')();
let conf = require('../local.json');

module.exports = {
	/**
	 * [logMessage description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	logMessage: function lmessage(req, res, next) {
		let params;
		let status;

		if (!req.body.time || !req.body.service || !req.body.corrId ) {
			status = 500;

			params = {
				time: Date.now(),
				service: 'log',
				corrId: req.body.corrId || 'not specified',
				userId: req.body.userId || 'not specified',
				message: 'log.server.api: parameters not specified',
				level: 'ERROR',
				trace: req.body.toString()
			};
		} else {
			status = 200;
			params = req.body;
		}

		r.db(conf.db.database)
			.table('log')
			.insert(params)
			.run()
			.error(err => {
				res.sendStatus(500);
				throw new Error('DB ERROR');
			});

		res.sendStatus(status);
	}
};
