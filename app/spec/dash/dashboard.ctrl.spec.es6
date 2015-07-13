/*'use strict';
import '../../src/js/common/error/common.error.module.es6';
import '../../src/js/dash/dashboard.module.es6';

describe('test angular', ()=> {
	let mock = angular.mock;
	const TEST_DATA = {
		rows: 3,
		widgets: [{id: 1}, {id: 2}]
	};
	let $log, $stateParams, LarchBoardSrvc;
	let DashboardCtrl;
	
	beforeEach(mock.module('larch.common.error'));
	beforeEach(mock.module('larch.dashboard'));

	beforeEach(mock.module(function($provide){
		$provide.service('$stateParams', function(){
			this.dashId = 1;
		});
		$provide.service('LarchBoardSrvc', function(){
			this.getById = function(){
				return new Promise(function(resolve, reject){
					resolve('the value');
				})
			};
			this.getCurrentRows = function() { return TEST_DATA.rows;};
			this.getCurrentWidgets = function() { return  TEST_DATA.widgets; };
			this.dashboards = [1,2,3];
		});
	}));

	beforeEach(mock.inject((_$log_, _$stateParams_, _LarchBoardSrvc_) => {
		$log = _$log_;
		$stateParams = _$stateParams_;
		LarchBoardSrvc = _LarchBoardSrvc_;

		spyOn(LarchBoardSrvc, 'getById');
	}));

	beforeEach(mock.inject(function($injector, $controller){
		//$log = $injector.get('$log');
		DashboardCtrl = $controller('DashboardCtrl',
			{$log: $log, $stateParams: $stateParams, LarchBoardSrvc: LarchBoardSrvc});

	}));

	it('should call LarchBoardSrvc methods', () => {
		expect(LarchBoardSrvc.getById).toHaveBeenCalledWith(1);
	});

	it('should get expected values from LarchBoardSrvc', function(){
		//expect()
	});

});
*/