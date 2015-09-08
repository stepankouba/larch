/**
 * keys used in questions definition:
 *  text: questions itself
 *  default: does the question have a default value? If any other value than false, the value is displayed in brackets
 *  isArray: when a value should be parsed as array
 */

export default {
	username: {
		text: 'Username:',
		default: false
	},
	password: {
		text: 'Password:',
		default: false,
		isHidden: true
	},
	[Symbol.iterator]: function* () {
		for (const key of Object.keys(this)) {
			yield [key, this[key]];
		}
	}
};