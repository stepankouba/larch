import WidgetValidator from '../../src/publish.widget.validator.es6';
import { LarchRegistry } from '../../lib/index.es6';
import nock from 'nock';

describe('registry unit tests', () => {
	const URL = 'https://localhost:9205';

	nock(URL)
		.matchHeader('Authorization', 'Bearer kjhfalsdkjhflajksdhfljkasd')
		.log(() => {})
		.post('/widget')
		.reply(200, {
			id: '12asdf-asdfasdf-364-667'
		})
		.post('/err/widget')
		.reply(500, {err: 'error'});

	it('should correctly perform testConf method on ok data', () => {
		const conf = {
			name: 'ok-value',
			title: 'test value',
			versions: {
				version: '1.0.0'
			}
		};

		LarchRegistry.errors = [];
		LarchRegistry._testConf(conf, WidgetValidator);

		expect(LarchRegistry.errors).toEqual([]);
	});

	it('should correctly perform testConf method on wrong data', () => {
		const conf = {
			name: 'wrong---da-value',
			title: 'test value',
			versions: {
				version: 'fasdfasd0'
			}
		};

		LarchRegistry.errors = [];

		LarchRegistry._testConf(conf, WidgetValidator);

		expect(LarchRegistry.errors.length).toEqual(2);
	});

	it('should correctly handle OK response in postToServer', done => {
		LarchRegistry.registryURL = URL;

		LarchRegistry.postToServer({test: 'OKdata'}, 'kjhfalsdkjhflajksdhfljkasd')('./test/larch.package.tar.gz')
			.then(res => {
				expect(res).toEqual({id: '12asdf-asdfasdf-364-667'});
				done();
			})
			.catch(err => {
				expect(err).toBeUndefined();
				done();
			});
	});

	it('should correctly handle ERR response in postToServer', done => {
		LarchRegistry.registryURL = `${URL}/err`;

		LarchRegistry.postToServer({test: 'ERRdata'}, 'kjhfalsdkjhflajksdhfljkasd')('./test/larch.package.tar.gz')
			.then(res => {
				expect(res).toBeUndefined();
				done();
			})
			.catch(err => {
				expect(err).toEqual({err: 'error'});
				done();
			});
	});
});