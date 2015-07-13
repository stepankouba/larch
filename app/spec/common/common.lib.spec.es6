'use strict';

import { DateTime, AJAXHelper, ObjectHelper } from '../../src/js/common/common.lib.es6';

describe('DateTime Helper', () => {
	it('should have a now method', () => {
		expect(DateTime.dateToString).toEqual(jasmine.any(Function));
	});

	it('should return string in format DD.MM - HH:MM:SS.MS', () => {
		let d = DateTime.dateToString('2015-02-01T08:12:10.56+01:00');

		expect(d).toMatch('01.02 - 08:12:10.56');
	});

	it('should return string in format DD.MM - HH:MM:SS.MS when params not set', () => {
		let d = DateTime.dateToString();

		expect(d).toMatch(/(\d{2}\.\d{2} - \d{2}:\d{2}:\d{2}.\d{1,4})/);
	});
});

describe('ObjectHelper', () => {
	it('should add define properties to target object', () => {
		let t = {};
		let s = {a1: 12, a2: 13, a3: 14};
		let def = {a2: 'id', a3: 'name'};

		ObjectHelper.copyDefinedProps(s, t, def)

		expect(t).toEqual({id: 13, name: 14});
	});

	it('should add nothing to target object', () => {
		let t = {};
		let s = {a1: 12, a2: 13, a3: 14};
		let def = {};

		ObjectHelper.copyDefinedProps(s, t, def)

		expect(t).toEqual({});
	});
});