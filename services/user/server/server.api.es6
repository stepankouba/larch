'use strict';

let lib = require('../../lib/lib.server.es6');
let helpers = require('./server.helpers.es6');

let user = {
	byId: function(req, res, next) {
		let id = req.params.id;

		if (!id) {
			res.status(500);
		} else {
			res.send(helpers.byId(id));
		}
	},
	login: function(req, res, next) {
		if (!req.body.username || !req.body.password) {
			return res.status(401).send('no user and / or password');
		}

		if (helpers.authenticate(req.body.username, req.body.password)) {
			let data = helpers.login(req.body.username);

			res.json(data);
		} else {
			res.status(401).send('username and / or password does not match');
		}
	},
	logout: function(req, res, next) {
		if (req.user) {
			console.log('token set', req.user.username);
		}

		res.send('logout');
	}
};

module.exports = user;
