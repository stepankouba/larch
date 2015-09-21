import { Request } from '../../lib.test/';

const conf = require('../local.json').environments.test;
const json = true;

describe('(api) User service tests', () => {
	let r;
	let token;
	let tokenAfterUpdate;

	describe('login user by /user/login', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/login?username=test@test.com&password=test', conf);

			r.request(done, {json});
		});

		it('should login user', () => {
			token = r.data.token;
			expect(r.error).toBeUndefined();
			expect(r.data.user.username).toEqual('test@test.com');
		});
	});

	describe('get user by /user/current', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/current', conf);

			r.request(done, {token, json});
		});

		it('should get user detail', () => {
			expect(r.error).toBeUndefined();
			expect(r.data.user.username).toEqual('test@test.com');
		});
	});

	describe('udpate name and settings of test user', () => {
		let data = {brekek: 'Kart fon Bahnhoff', password: 'afsdasd'};

		beforeEach(done => {
			r = Request.create('PUT', '/user/test@test.com', conf);

			r.request(done, {token, data, json});
		});

		it('should NOT update test\'s name', () => {
			expect(r.data.msg).toEqual('nothing to update');

			data = {name: 'Kart fon Bahnhoff'};
		});

		it('should update test\'s name', () => {
			tokenAfterUpdate = r.data.token;
			expect(r.data.user.name).toEqual('Kart fon Bahnhoff');
		});

		it('should fail to update once again, since token has changed', () => {
			expect(r.error.code).toEqual(401);
		});
	});

	describe('logout user by /user/logput', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/current/logout', conf);

			r.request(done, {token: tokenAfterUpdate, json});
		});

		it('should logout user', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).toEqual({msg: 'logged out'});
		});
	});

	describe('logout user by /user/logout, once user is already logged out', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/current/logout', conf);

			r.request(done);
		});

		it('should failt to logout user', () => {
			expect(r.error).not.toBeUndefined();
			expect(r.error.code).toEqual(401);
		});
	});

	describe('create new user, which already exists', () => {
		let data = {name: 'user'};
		const dataOKButExisting = {name: 'OKButExisting', username: 'test@test.com', password: '1asd54DDF645d'};
		const dataOK = {name: 'OKButExisting', username: 'test_new@test.com', password: '1asd54DDF645d'};

		beforeEach(done => {
			r = Request.create('POST', '/user/', conf);

			r.request(done, {data, json});
		});

		it('should throw an error', () => {
			expect(r.error.code).toEqual(400);
			data = dataOKButExisting;
		});

		it('should throw an error when updating already existing user', () => {
			expect(r.error.code).toEqual(400);
			expect(r.error.data.msg).toEqual('existing user');
			data = dataOK;
		});

		it('should create a new user', () => {
			expect(r.error).toBeUndefined();
			expect(r.data.user.username).toEqual('test_new@test.com');
		});
	});

	describe('confirm new user with hash with error', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/confirm?password=asdfasd&hash=4362e93e0703821eddab5d2200', conf);

			r.request(done);
		});

		it('should not confirm user', () => {
			expect(r.error).not.toBeUndefined();
			expect(r.error.code).toEqual(400);
		});
	});

	describe('confirm new user with hash without error', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/confirm?password=test&hash=4362e93e0703821eddab5d220', conf);

			r.request(done);
		});

		it('should confirm user', () => {
			expect(r.error).toBeUndefined();
			expect(r.data.user.username).toEqual('test_confirm@test.com');
			expect(typeof r.data.token).toEqual('string');
		});
	});

});