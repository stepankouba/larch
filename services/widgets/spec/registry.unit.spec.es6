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
		Registry._requestDB({name: 'redmine-issues-log'})
			.then(r => {
				expect(r[1].length).toBe(1);
				expect(r[1][0].title).toBe('Redmine issue log');
				done();
			});
	});

	it('should request DB by _requestDB with no result', done => {
		Registry._requestDB({name: 'Gitlab request skljdhflaskjhd'})
			.then(result => {
				expect(result[1].length).toBe(0);
				done();
			});
	});

	it('should check if _isWidgetInRegistry to return true', done => {
		const widget = {
			name: 'gitlab-commits',
			version: {version: '1.5.0'}
		};
		const result = [{
			name: 'gitlab-commits',
			versions: [{version: '1.0.0'}, {version: '0.6.0'}]
		}];

		Registry._isWidgetInRegistry([widget, result])
		.then(isInDB => {
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
		const widget = {
			name: 'gitlab-commits',
			version: {version: '1.0.0'}
		};
		const result = [{
			name: 'gitlab-commits',
			versions: [{version: '1.0.0'}, {version: '0.6.0'}]
		}];

		Registry._isWidgetInRegistry([widget, result])
		.then(isInDB => {})
		.catch(err => {
			expect(err instanceof Error).toBeTruthy();
			done();
		});
	});

	it('should save a JSON to registry', done => {
		/*eslint no-sync:0 */
		const widget = JSON.parse(fs.readFileSync('./spec/data/widget-save.json', 'utf8'));
		const currentWidget = {};

		Registry._saveToRegistry([widget, currentWidget])
			.then(result => {
				r.db(conf.db.database)
					.table('widgets')
					.filter({name: widget.name})
					.then(res => {
						expect(res[0].name).toBe(widget.name);
						done();
					})
					.catch(err => {
						expect(err).toBeUndefined();
						done();
					});
			});
	});

	it('should update the JSON in registry', done => {
		/*eslint no-sync:0 */
		const currentWidget = JSON.parse(fs.readFileSync('./spec/data/widgets.json', 'utf8'))[0];
		const widget = JSON.parse(fs.readFileSync('./spec/data/widget-save.json', 'utf8'));

		Registry._saveToRegistry([widget, currentWidget])
			.then(result => {
				r.db(conf.db.database)
					.table('widgets')
					.get(currentWidget.id)
					.then(res => {
						expect(res.versions.length).toBe(2);
						expect(res.versions[0].version).toBe(widget.version.version);
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