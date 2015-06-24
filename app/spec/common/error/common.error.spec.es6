'use strict';

import '../../../src/js/common/error/common.error.module.es6'

describe('test angular', ()=> {
	let mock = angular.mock;
	let $log;

	beforeEach(mock.module('larch.common.error'));

	beforeEach(mock.inject((_$log_) => {
		$log = _$log_;
	}));

	it('should log to console including time', () => {
		$log.debug('test');

		expect($log.debug.logs[0].join('')).toMatch(/(\d{2}\.\d{2} - \d{2}:\d{2}:\d{2}.\d{1,4}) - test/);
	});

	it('should log to console including time and module name', () => {
		$log = $log.getLogger('MasterCtrl');

		$log.debug('test');

		expect($log.debug.logs[0].join('')).toMatch(/(\d{2}\.\d{2} - \d{2}:\d{2}:\d{2}.\d{1,4}) - MasterCtrl:: test/);
	});

});
