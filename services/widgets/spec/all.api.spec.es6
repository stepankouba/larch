import { Request } from '../../lib.test/';
import path from 'path';

const conf = require('../local.json').environments.test;

describe('(api) Widgets service tests', () => {
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
			r = Request.create('GET', '/widget/1,2', conf);

			r.request(done);
		});

		it('should get id from /widget/1,2', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.length).toBe(2);
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
			r = Request.create('GET', '/widgets?phrase=commits', conf);

			r.request(done);
		});

		it('should get error from /widgets?phrase', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.length).toBe(2);
		});
	});

	describe('get asseet by name, version and asset name', () => {
		beforeEach(done => {
			r = Request.create('GET', '/widget/test/1.0/asset/test.html', conf);

			r.request(done, {json: false});
		});

		it('should get error from /widget/test/1.0.0/asset/test.html', () => {
			expect(r.error).toBeUndefined();
			expect(r.data).not.toBeUndefined();
			expect(r.data.startsWith('<!DOCTYPE html>')).toBeTruthy();
		});
	});

	describe('post assets and JSON to /widget', () => {
		beforeEach(done => {
			const data = require('./data/widget-post.json');
			r = Request.create('POST', '/widget', conf);

			r.requestMultipart(done, data, path.resolve(__dirname, './data/testfile.tar.gz'));
		});

		it('should post a JSON file to /widget', done => {
			expect(r.error).toBeUndefined();

			const rr = Request.create('GET', '/widgets?phrase=github', conf);

			rr.request(() => {
				expect(rr.data.length).toBe(2);
				done();
			});
		});
	});

});