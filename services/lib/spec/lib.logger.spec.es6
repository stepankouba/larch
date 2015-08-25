import {logger} from '../';
import RethinkDb from 'rethinkdbdash';

let conf = require('../local.json');
let r = RethinkDb();

describe('logger test suited', () => {

	describe('info handling', () => {
		let results = [];

		beforeEach(done => {
			spyOn(process.stdout, 'write');

			r.db(conf.db.database)
				.table(conf.db.collection)
				.count()
				.run()
				.then(result => {
					results.push(result);
					
					logger.log('info', 'testing', {}, (err, level, msg, meta) => {
						done();
					});
				});
		});

		it('should log into into console', () => {
			expect(process.stdout.write).toHaveBeenCalled();
		});

		it('should log into rdb', done => {
			// console.log('it2');
			r.db(conf.db.database)
				.table(conf.db.collection)
				.count()
				.run()
				.then(result => {
					expect(results[1] - results[0]).toEqual(1);
					done();
				});
		});
	});
});