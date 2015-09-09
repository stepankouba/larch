import WidgetValidator from '../../src/publish.widget.validator.es6';
import { LarchRegistry } from '../../lib/index.es6';

describe('registry unit tests', () => {
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
});