'use strict';
let helpers = require('./server.helpers.es6');

let service = {
	issueLog: function(req, res, next) {
		let taskId = req.params.id;

		helpers._getIssueRawData(taskId)
			.then(result => {
				let data;

				// create new object				
				data = helpers._createData(result);

				res.type('application/json');
                res.send(data);
			})
			.catch(err => {
				console.log(err);
				res.sendStatus(500);
			});

	},

	issuesUserLog: function(req, res, next) {
		let userName = req.params.user;
		let month = req.params.month;

		helpers.getIssuesForUser(userName, month)
			.then(results => {
				let promises = [];
				
				results.forEach(r => {
					promises.push(helpers._getIssueRawData(r.id));
				});

				return Promise.all(promises);
			})
			.then(results => {
				let data = [];

				results.forEach(r => {
					data.push(helpers._createData(r));
				});

				res.type('application/json');
                res.send(data);
			})
			.catch(err => {
				res.sendStatus(500);
				
				console.log(err.toString());
			});
	},
	monthVersion: function(req, res, next) {
		let month = req.params.month;
		let projects = req.params.projects;

		// doubling the params because of the syntax of the query
		helpers.requestDB(helpers.sqls.monthVersion, projects, month, projects, month)
			.then(value => {
				res.type('application/json');
                res.send(value[0]);
			})
			.catch(err => {
				res.sendStatus(500);
				
				console.log(err.toString());
			});
	},
	lastWeekSpent: function(req, res, next) {
		helpers.requestDB(helpers.sqls.lastWeekSpent)
			.then(value => {
				res.type('application/json');
                res.send(value[0]);
			})
			.catch(err => {
				res.sendStatus(500);
				
				console.log(err.toString());
			});
	},

	allSpent: function(req, res, next) {
		helpers.requestDB(helpers.sqls.allSpent)
			.then(value => {
				res.type('application/json');
                res.send(value[0]);
			})
			.catch(err => {
				res.sendStatus(500);
				
				console.log(err.toString());
			});
	},
};

module.exports = service;
