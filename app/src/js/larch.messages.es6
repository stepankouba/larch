import Errors from './larch.errors.es6';

const Msgs = {
	[Errors.WRONG_USERNAME_AND_PASS]: 'Could not log you in. Please try again.',
	[Errors.LOGIN_ERR]: 'Something really bad happened. Please try again later...'
};

export default {
	get(id) {
		return Msgs[id] ? Msgs[id] : 'NO MSG DEFINED';
	}
};