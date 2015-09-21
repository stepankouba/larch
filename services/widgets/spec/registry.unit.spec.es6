import fs from 'fs';
import Registry from '../server/server.registry.es6';
import { Service } from '../../lib/';
import RethinkDB from 'rethinkdbdash';

const conf = require('../local.json').environments.test;
const r = RethinkDB();

describe('(unit) Registry tests', () => {
	beforeEach(() => {
		Service.instance.conf = conf;
	});

	it('should request DB by _requestDB with 1 result', done => {
		Registry._requestDB('redmine-issues-log')
			.then(r => {
				expect(r.length).toBe(1);
				expect(r[0].title).toBe('Redmine issue log');
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

	it('should save a JSON to registry', done => {
		Registry.json = JSON.parse(fs.readFileSync('./spec/data/widget-save.json', 'utf8'));
		Registry.newHasToBeInserted = true;

		const fn = Registry._saveToRegistry();

		fn()
			.then(result => {
				r.db(conf.db.database)
					.table('widgets')
					.filter({name: Registry.json.name})
					.then(res => {
						expect(res[0].name).toBe(Registry.json.name);
						done();
					})
					.catch(err => {
						expect(err).toBeUndefined();
						done();
					});
			});
	});

	it('should update the JSON in registry', done => {
		/* eslint no-sync: false */
		Registry.currentWidget = JSON.parse(fs.readFileSync('./spec/data/widgets.json', 'utf8'))[0];
		Registry.json = JSON.parse(fs.readFileSync('./spec/data/widget-save.json', 'utf8'));
		Registry.newHasToBeInserted = false;

		const fn = Registry._saveToRegistry();

		fn()
			.then(result => {
				r.db(conf.db.database)
					.table('widgets')
					.get(Registry.currentWidget.id)
					.then(r => {
						expect(r.versions.length).toBe(2);
						expect(r.versions[0].version).toBe(Registry.json.versions.version);
						delete Registry.currentWidget;
						done();
					})
					.catch(err => {
						expect(err).toBeUndefined();
						done();
					});
			})
			.catch(err => {
				expect(err).toBeUndefined();
				done();
			});
	});

});