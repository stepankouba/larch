const Msgs = {
	// login
	'WRONG_USERNAME_AND_PASS_ERR': 'Could not log you in. Please try again.',
	'LOGIN_ERR': 'Something really bad happened. Please try again later...',
	// register
	'REGISTER_MISSING_DATA_ERR': 'Hey, you have to give us a chance to know about you at least something.',
	'INVALID_EMAIL_ERR': 'Incorrect email...',
	'EXISTING_USER_ERR': 'Username already exist, pick up a new one.',
	'REGISTER_CONFIRM_PASS_ERR': 'Have a look at passwords. They don\'t match',
	'INVALID_PASS_ERR': 'Change password to something else... <br> * containing at least 6 characters <br> * contain at least 1 number <br> * contain at least 1 lowercase character <br> * contain at least 1 uppercase character (A-Z)',
	// general
	'GENERAL_RESULT_ERR': 'We were not able to deliver the request to backend...',
	'GENERAL_RESULT_OK': 'Well done...',
	// modal new DS
	'NEW_SHARED_URL_ERR': 'URL is strange. Should be something like<br>https://anylarch.com/public/adfjsdf-sadfjs-asdkfjsd',
	'SAME_NAME_EXISTS_ERR': 'Same name already in your views list already exists. Please choose a new one',
	'INVALID_PUBLIC_ID_ERR': 'Ouch... wrong public view. Please check the URL and try again',
	// modal edit DS
	'UPDATE_MISSING_FIELDS_ERR': 'Hey, have you filled in all the fields?',
	'UPDATE_FROM_SHARED_ERR': 'You are trying to updated view, which comes from shared one. Don\'t do that',
	'UPDATE_MISSING_ID_ERR': 'ID is missing in the request',
	'UPDATE_FIELDS_NOT_ALLOWED_ERR': 'Can not update, what you\'re asking for...',
	// remove DS
	'REMOVE_NOT_OWNER_ERR': 'You can\'t remove something you don\'t own',
	'REMOVE_NO_ID_ERR': 'You can\'t remove something you don\'t own',
	// load DS
	'GET_DS_NO_USER_ERR': 'You have not specified the user',
	'GET_DS_NO_ID_ERR': 'Hmm... How can I know, what to load, if there\'s no ID defined',
	// settings
	'SETT_NAME_MISSING_ERR': 'What about filling name of the view?',
};

export default {
	get(id) {
		return Msgs[id] ? Msgs[id] : 'NO MSG DEFINED';
	}
};