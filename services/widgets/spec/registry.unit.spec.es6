import fs from 'fs';
import Registry from '../server/server.registry.es6';
import { Service } from '../../lib/';

const conf = require('../local.json').environments.test;

describe('(unit) Registry tests', () => {
	beforeEach(() => {
		Service.instance.conf = conf;
	});

	it('should request DB by _requestDB with 1 result', done => {
		Registry._requestDB('redmine-issues-log')
			.then(result => {
				expect(result.length).toBe(1);
				expect(result[0].title).toBe('Redmine issue log');
				done();
			});
	});

	it('should request DB by _requestDB with no result', done => {
		Registry._requestDB('Gitlab request skljdhflaskjhd')
			.then(result => {
				expect(result.length).toBe(0);
				done();
			});
	});

	it('should check if _isWidgetInRegistry to return true', done => {
		Registry.json = {
			name: 'gitlab-commits',
			versions: {version: '1.5.0'}
		};

		const fn = Registry._isWidgetInRegistry();
		fn([{
			name: 'gitlab-commits',
			versions: [{version: '1.0.0'}, {version: '0.6.0'}]
		}]).then(isInDB => {
			expect(Registry.newHasToBeInserted).toBeFalsy();
			expect(isInDB).toBeTruthy();
			done();
		}).catch(err => {
			console.log(err);
			expect(err instanceof Error).toBeFalsy();
			done();
		});
	});

	it('should check if _isWidgetInRegistry to throw error', done => {
		Registry.json = {
			name: 'gitlab-commits',
			versions: {version: '1.0.0'}
		};

		const fn = Registry._isWidgetInRegistry();
		fn([{
			name: 'gitlab-commits',
			versions: [{version: '1.0.0'}, {version: '0.6.0'}]
		}]).then(isInDB => {})
		.catch(err => {
			expect(err instanceof Error).toBeTruthy();
			done();
		});
	});

	it('should create dir only when required', done => {
		Registry.json = {
			name: 'Gitlab merge requests - test',
			version: '1.0.0'
		};

		const fn = Registry._createDir();
		fn(false)
			.then(result => {
				fs.stat(`${Registry.REGISTRY_PATH}/${Registry.json.name}`, (err, s) => {
					expect(err).toBeFalsy();
					expect(s.isDirectory()).toBeTruthy();
					done();
				});
			});
	});

	it('should extract file into directory', done => {
		Registry.file = {
			path: `${__dirname}/data/testfile.tar.gz`
		};
		Registry.json = {
			name: 'Gitlab merge requests',
			versions: {version: '1.5.0'}
		};

		const fn = Registry._saveToDir();

		fn()
			.then(res => {
				expect(res).toBeTruthy();
				fs.stat(`${Registry.REGISTRY_PATH}/${Registry.json.name}/${Registry.json.versions.version}/test.html`, (err, s) => {
					expect(err).toBeFalsy();
					expect(s.isFile()).toBeTruthy();
					done();
				});
			})
			.catch(err => {
				expect(err).toBeFalsy();
				done();
			});
	});

});