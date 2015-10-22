import Errors from './larch.errors.es6';

const Msgs = {
	// login
	[Errors.WRONG_USERNAME_AND_PASS]: 'Could not log you in. Please try again.',
	[Errors.LOGIN_ERR]: 'Something really bad happened. Please try again later...',
	// register
	[Errors.REGISTER_MISSING_DATA]: 'Hey, you have to give us a chance to know about you at least something.',
	[Errors.INVALID_EMAIL]: 'Incorrect email...',
	[Errors.EXISTING_USER]: 'Username already exist, pick up a new one.',
	[Errors.REGISTER_CONFIRM_PASS]: 'Have a look at passwords. They don\'t match',
	[Errors.INVALID_PASS]: 'Change password to something else... <br> * containing at least 6 characters <br> * contain at least 1 number <br> * contain at least 1 lowercase character <br> * contain at least 1 uppercase character (A-Z)',
};

export default {
	get(id) {
		return Msgs[id] ? Msgs[id] : 'NO MSG DEFINED';
	}
};