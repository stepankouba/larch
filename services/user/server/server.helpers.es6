'use strict';


let auth = require('../../lib/lib.auth.server.es6')

let helpers = {
	byName: function(name){
		return {
			username: 'test',
			id: 1,
			description: 'testing info'
		};
	},
	byId: function(id){
		return {
			username: 'test',
			id: 1,
			description: 'testing info'
		};
	},
	authenticate: function(username, password){
		return username === 'test' && password  === 'test';
	},
	login: function(username) {
		// return user object
		let user = this.byId(username);
		delete user.password;

		return {user: user, token: auth.createToken(user)};
	},
};

module.exports = helpers;