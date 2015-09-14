import RethinkDB from 'rethinkdbdash';
import Auth from '../server/server.auth.es6';
import { Service } from '../../lib/';
import ServiceAuth from '../../lib/lib.service.auth.es6';

const r = RethinkDB();
const conf = require('../local.json').environments.test;

describe('(unit) auth unit tests', () => {
	beforeEach(() => {
		Service.instance.conf = conf;
		Service.Auth = ServiceAuth;
	});

	it('should login test user on method login', done => {
		Auth.login('test@test.com', 'test')
			.then(res => {
				expect(res.user.username).toEqual('test@test.com');
				expect(typeof res.token).toBe('string');
				done();
			})
			.catch(err => {
				expect(err).toBeUndefined();
				done();
			});
	});

	it('should not login user on method login with wrong usernam', done => {
		Auth.login('asdfasdf', 'asdfasd')
			.then(res => {
				expect(res).toBeUndefined();
				done();
			})
			.catch(err => {
				expect(err).toBeFalsy();
				done();
			});
	});

	it('should confirm new user using confirm method', done => {
		Auth.confirm('4362e93e0703821eddab5d230', 'test')
			.then(res => {
				expect(res.user.username).toEqual('test_confirm_unit@test.com');
				expect(typeof res.token).toBe('string');

				r.db(conf.db.database)
					.table('users')
					.filter({username: 'test_confirm_unit@test.com'})
					.run()
					.then(result => {
						expect(result[0].available).toBeTruthy();
						done();
					})
					.catch(err => {
						expect(err).toBeUndefined();
						done();
					});
			})
			.catch(err => {
				console.log(err.stack);
				expect(err).toBeUndefined();
				done();
			});
	});

});