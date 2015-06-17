'use strict';

let sqls = require('./server.sqls.es6');
let mysql = require('mysql');
let conf = require('../local.json');
let pool = mysql.createPool({
        host: conf.db.host,
        user: conf.db.user,
        password: conf.db.password,
        database: conf.db.database,
        multipleStatements: true
    });
/**
 * How many days backwards the information is created
 * @type {Number}
 */
const LIMIT_DAYS = 7;

/**
 * Helpers object for calclations
 * @type {Object}
 */
let helpers = {
	conn: null,
	sqls: sqls,

	/**
	 * [requestDB description]
	 * @param  {[type]} conn   [description]
	 * @param  {[type]} sql    [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	requestDB: function(sql, ...params) {
		//console.log('requesting DB...', sql);

		return new Promise((resolve, reject) => {
			pool.query(sql, params,
				(err, rows) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				}
			);
		});
	},
	_getIssueRawData: function(taskId) {

		return Promise.all([
			helpers.requestDB(helpers.sqls.issueDetail, taskId),
			helpers.requestDB(helpers.sqls.tsAllDetailed, taskId),
			helpers.requestDB(helpers.sqls.users),
			helpers.requestDB(helpers.sqls.journal, taskId),
			helpers.requestDB(helpers.sqls.customFields, taskId),
			helpers.requestDB(helpers.sqls.lastNote, taskId)
		]);
			
	},


	_getTsForDay: function(date, ts) {
		//let date = new Date(day);
		let total = 0;

		ts.forEach(day => {
			let d = new Date(day.spent_on);
			if (d <= date ) {
				total += day.sum_hours;
			}
		});

		return total;
	},

	/**
	 * Update one day object with data from journal
	 * @param  {[type]} dayObj  [description]
	 * @param  {[type]} journal [description]
	 * @param  {[type]} users   [description]
	 * @param  {[type]} cfs     [description]
	 * @return {[type]}         [description]
	 */
	_updateDay: function(dayObj, journal, users, cfs) {
		//console.log(dayObj.date, journal);

		journal.forEach(change => {
			switch(change.prop_key) {
				case 'status_id':
					dayObj.status_id = parseInt(change.old_value);
					break;
				case 'estimated_hours':
					dayObj.estimated = parseFloat(change.old_value);
					break;
				case 'assigned_to_id':
					dayObj.assignee = users.filter(u => u.id === parseInt(change.old_value))[0].login;
					break;
				case 'done_ratio':
					dayObj.doneRatio = parseInt(change.old_value);
					break;
				case 7:
					dayObj.etc = parseFloat(change.old_value);
			}// switch
			
		});
	},

	_createData: function(result) {
		let [issue, ts, users, journal, customFields, lastNote] = result;
		let data;
		let currDate = new Date(Date.now());
		const ONE_DAY = 86400000;

		console.log(lastNote);

		// create initial values
		data = {
			days: [{
				date: currDate,
				estimated: issue[0].estimated_hours,
				spent: helpers._getTsForDay(currDate, ts),
				etc: customFields.filter(item => item.name === 'ETC').value,
				status_id: issue[0].status_id,
				doneRatio: issue[0].done_ratio,
				assignee: issue[0].login
			}],
			lastNote: lastNote[0] ? lastNote[0].notes : '', 
			id: issue[0].id,
			subject: issue[0].subject
		};

		// for each and every day
		for (let i = 1; i < LIMIT_DAYS; i++) {
			let oldValues = data.days[i - 1];
			let newValues = Object.assign({}, oldValues);

			// update date
			newValues.date = new Date(oldValues.date - ONE_DAY);
			let test

			// update spent
			newValues.spent = helpers._getTsForDay(newValues.date, ts);

			let jValues = journal.filter(item => {
				return (newValues.date - new Date(item.created_on)) <= ONE_DAY;
			});			

			// found something
			if (jValues.length > 0) {
				helpers._updateDay(newValues, jValues, users, customFields);
			}

			data.days.push(newValues);
		}// for

		return data;
	},

	getIssuesForUser: function(user, month) {
		return helpers.requestDB(helpers.sqls.issuesForUser, user, month);
	}
};

module.exports = helpers;