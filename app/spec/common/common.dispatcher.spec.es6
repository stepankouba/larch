import Dispatcher from '../../src/js/common/common.dispatcher.es6';

const acts = {
	EDIT_USER: 'editUser',
	ADD_USER: 'addUser',
	REMOVE_USER: 'removeUser'
};

let steps = [];

let cb1 = function(data) { steps.push('cb1'); };
let cb2 = function(data) { steps.push('cb2'); };
let cb3 = function(data) { steps.push('cb3'); };
let cb4;
let cb5 = function(data) { steps.push('cb5'); };
let cb6 = function(data) { steps.push('cb6'); };


describe('Dispatcher', function(){
	let app;
	const ID_1 = 'dispatcher-id-1';
	const ID_2 = 'dispatcher-id-2';

	beforeEach(function(){
		app = Dispatcher.create();

		app.register('User', acts.EDIT_USER, cb1 );
		app.register('User', acts.REMOVE_USER, cb2);
		app.register('Model', acts.ADD_USER, cb3);
		app.register('Admin', acts.REMOVE_USER, cb6);

		steps = [];
	});

	describe('Dispatcher - register', function(){
		it('should register actions', function(){
			let actions = Object.keys(app.chamber);

			expect(app._lastNumId).toEqual(4);

			// two actions registered
			expect(actions.length).toEqual(3);

			expect(actions[0]).toEqual(acts.EDIT_USER);
			expect(actions[1]).toEqual(acts.REMOVE_USER);
			expect(actions[2]).toEqual(acts.ADD_USER);
		});

		it('should register models', function(){
			let action1 = app.chamber[acts.ADD_USER];
			let action2 = app.chamber[acts.REMOVE_USER];

			expect(Object.keys(action1).length).toEqual(1);
			expect(Object.keys(action2).length).toEqual(2);
		});

		it('should create unique ids', function(){
			expect(app.chamber[acts.EDIT_USER].User).toEqual(ID_1);
			expect(app.chamber[acts.REMOVE_USER].User).toEqual(ID_2);
		});

		it('should register callbacks', function(){
			expect(Object.keys(app._callbacks).length).toEqual(4);

			expect(app._callbacks[ID_1]).toEqual(cb1);
			expect(app._callbacks[ID_2]).toEqual(cb2);
		});
	});

	describe('Dispatcher - dispatch without waitFor', function(){
		let data = {test: 'test'};

		it('should dispatch an action', function(){
			// dispatch and check 
			app.dispatch(acts.EDIT_USER, data);

			expect(steps).toEqual(['cb1']);
		});

		it('should dispatch mode actions', function(){
			// dispatch and check 
			app.dispatch(acts.REMOVE_USER, data);

			expect(steps).toEqual(['cb2', 'cb6']);
		});
	});

	describe('Dispatcher - dispatch with waitFor', function(){
		let data = {test: 'test'};

		it('Admin Model should wait for SuperUser model', function(){
			cb4 = function(data) {
				app.waitFor(['SuperUser']);
				steps.push('cb4');
			};

			app.register('Admin', acts.EDIT_USER, cb4);
			app.register('SuperUser', acts.EDIT_USER, cb5);

			app.dispatch(acts.EDIT_USER, data);

			expect(steps).toEqual(['cb1', 'cb5', 'cb4']);
		});
	});
});
