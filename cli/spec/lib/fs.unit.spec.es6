import { LarchFS } from '../../lib/index.es6';
import path from 'path';

describe('fs unit tests', () => {
	it('should create Gzip', done => {
		LarchFS.createGzip(path.resolve('./test/'))
			.then(res => {
				expect(res).toContain('larch.package.tar.gz');
				done();
			})
			.catch(err => {
				expect(err).toBeUndefined();
				done();
			});
	});
});