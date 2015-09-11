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
});