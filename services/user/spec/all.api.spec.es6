import { Request } from '../../lib.test/';

const conf = require('../local.json').environments.test;

describe('(api) User service tests', () => {
	let r;

	describe('login user by /user/login', () => {
		beforeEach(done => {
			r = Request.create('GET', '/user/login?username=test@test.com&password=test', conf);

			r.request(done);
		});

		it('should login user', () => {
			expect(r.error).toBeUndefined();
			expect(r.data.user.username).toEqual('test@test.com');
		});
	});

});