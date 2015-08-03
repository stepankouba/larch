'use strict';

import TestData from './dashboard.board.srvc.testdata.json';
import '../../src/js/dash/dashboard.module.es6';

describe('LarchBoardSrvc', function(){
	let LarchBoardSrvc;
	let httpBackend;
	let DashSrvc;
	let mock = angular.mock;

	beforeEach(mock.module('larch.dashboard'));

	beforeEach(mock.inject(function(_LarchBoardSrvc_, _DashSrvc_, _$httpBackend_){
		LarchBoardSrvc = _LarchBoardSrvc_;
		DashSrvc = _DashSrvc_;
		httpBackend = _$httpBackend_;
	}));

	it('should get all dashboards for a user', function(){
		httpBackend.whenGET('http://localhost:9004/dash/all/1').respond(TestData);
		LarchBoardSrvc.getAll()
			.then(function(){
				expect(LarchBoardSrvc.dashboards).toEqual(TestData);
			});
		httpBackend.flush();
	});

	it('should get specified dashboard for a user', function(){
		httpBackend.whenGET('http://localhost:9004/dash/1').respond(TestData[0]);
		LarchBoardSrvc.getById(1)
			.then(function(){
				expect(LarchBoardSrvc.dashboard).toEqual(TestData[0]);
			});
		httpBackend.flush();
	});

	it('should perform proper getCurrentWidgets', function(){
		const WIDGET_WIDTH = 3;

		let widgets = TestData[0].widgets.map(item => {
			item.width = item.w * WIDGET_WIDTH;
			item.height = item.h;

			return item;
		})

		LarchBoardSrvc.dashboard = TestData[0];
		expect(LarchBoardSrvc.getCurrentWidgets()).toEqual(widgets);
	});

	
});