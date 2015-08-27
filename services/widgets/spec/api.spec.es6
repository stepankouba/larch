import { Request } from '../../lib.test/';

const conf = require('../../master.services.json');

describe('Widgets service API tests', () => {
	let r;

	describe('get widget by single id', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widget/1', conf);

			r.request(done);
		});

		it('should get id from /widget/1', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.length).toBe(1);
		});
	});

	describe('get widget by multiple ids', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widget/1,2,3', conf);

			r.request(done);
		});

		it('should get id from /widget/1,2,3', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.length).toBe(3);
		});
	});

	describe('get errror with wrong request', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widasdasdfas', conf);

			r.request(done);
		});

		it('should get error from /widasdasdfas', () => {
			expect(r.error).not.toBeUndefined();
			expect(r.error.code).toBe(404);
			expect(r.data).toBeUndefined();
		});
	});

	describe('get phrase search', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widgets?phrase=Accurity', conf);

			r.request(done);
		});

		it('should get error from /widgets?phrase', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.length).toBeGreaterThan(1);
		});
	});

	describe('get asseet by name, version and asset name', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widget/test/1.0/asset/test.html', conf);

			r.request(done, {json: false});
		});

		it('should get error from /widget/test/1.0/asset/test.html', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.startsWith('<!DOCTYPE html>')).toBeTruthy();
		});
	});

});