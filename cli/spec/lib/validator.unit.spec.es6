import { Validator } from '../../lib/index.es6';

describe('validator unit tests', () => {
	it('should correctly perform isDashSeparated method', () => {
		expect(Validator.isDashSeparated('test-value-is')).toBeTruthy();
		expect(Validator.isDashSeparated('test')).toBeTruthy();
		expect(Validator.isDashSeparated('test---value-is-')).toEqual(jasmine.any(Error));
		expect(Validator.isDashSeparated('')).toEqual(jasmine.any(Error));
	});

	it('should correctly perform isString method', () => {
		expect(Validator.isString('string')).toBeTruthy();
		expect(Validator.isString([])).toEqual(jasmine.any(Error));
		expect(Validator.isString({})).toEqual(jasmine.any(Error));
	});

	it('should correctly perform isNotEmpty method', () => {
		expect(Validator.isNotEmpty('   string ')).toBeTruthy();
		expect(Validator.isNotEmpty('    ')).toEqual(jasmine.any(Error));
		expect(Validator.isNotEmpty(' a')).toBeTruthy();
	});

	it('should correctly perform isNotEmptyString method', () => {
		expect(Validator.isNotEmptyString('   string')).toBeTruthy();
	});

	it('should correctly perform isArray method', () => {
		expect(Validator.isArray([1,2,3,4, {}])).toBeTruthy();
		expect(Validator.isArray('string')).toEqual(jasmine.any(Error));
		expect(Validator.isArray([])).toBeTruthy();
	});
});