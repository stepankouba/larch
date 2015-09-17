import Dispatcher from '../../src/js/common/common.dispatcher.es6';

const acts = {
	EDIT_USER: 'editUser',
	ADD_USER: 'addUser',
	REMOVE_USER: 'removeUser'
};

let steps = [];

const cb1 = data => steps.push('cb1');
const cb2 = data => steps.push('cb2');
const cb3 = data => steps.push('cb3');
let cb4;
const cb5 = data => steps.push('cb5');
const cb6 = data => steps.push('cb6');

describe('Dispatcher', () => {
	let app;
	const ID_1 = 'dispatcher-id-1';
	const ID_2 = 'dispatcher-id-2';

	beforeEach(() => {
		app = Dispatcher.create();

		app.register('User', acts.EDIT_USER, cb1);
		app.register('User', acts.REMOVE_USER, cb2);
		app.register('Model', acts.ADD_USER, cb3);
		app.register('Admin', acts.REMOVE_USER, cb6);

		steps = [];
	});

	describe('Dispatcher - register', () => {
		it('should register actions', () => {
			const actions = Object.keys(app.chamber);

			expect(app._lastNumId).toEqual(4);

			// two actions registered
			expect(actions.length).toEqual(3);

			expect(actions[0]).toEqual(acts.EDIT_USER);
			expect(actions[1]).toEqual(acts.REMOVE_USER);
			expect(actions[2]).toEqual(acts.ADD_USER);
		});

		it('should register models', () => {
			let action1 = app.chamber[acts.ADD_USER];
			let action2 = app.chamber[acts.REMOVE_USER];

			expect(Object.keys(action1).length).toEqual(1);
			expect(Object.keys(action2).length).toEqual(2);
		});

		it('should create unique ids', () => {
			expect(app.chamber[acts.EDIT_USER].User).toEqual(ID_1);
			expect(app.chamber[acts.REMOVE_USER].User).toEqual(ID_2);
		});

		it('should register callbacks', () => {
			expect(Object.keys(app._callbacks).length).toEqual(4);

			expect(app._callbacks[ID_1]).toEqual(cb1);
			expect(app._callbacks[ID_2]).toEqual(cb2);
		});
	});

	describe('Dispatcher - dispatch without waitFor', () => {
		const data = {test: 'test'};

		it('should dispatch an action', () => {
			// dispatch and check
			app.dispatch(acts.EDIT_USER, data);

			expect(steps).toEqual(['cb1']);
		});

		it('should dispatch mode actions', () => {
			// dispatch and check
			app.dispatch(acts.REMOVE_USER, data);

			expect(steps).toEqual(['cb2', 'cb6']);
		});
	});

	describe('Dispatcher - dispatch with waitFor', () => {
		const data = {test: 'test'};

		it('Admin Model should wait for SuperUser model', () => {
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
