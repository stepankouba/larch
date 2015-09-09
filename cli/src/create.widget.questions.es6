/**
 * keys used in questions definition:
 *  text: questions itself
 *  default: does the question have a default value? If any other value than false, the value is displayed in brackets
 *  isArray: when a value should be parsed as array
 */

export default {
	name: {
		text: 'What is the widget name (e.g. testing-name)?',
		default: false
	},
	title: {
		text: 'What should be the title of the widget?',
		default: false
	},
	tags: {
		text: 'Any tags to be used to identify the widget (separate by comma)?',
		default: false,
		isArray: true
	},
	authors: {
		text: 'Who are the authors (usernames, separate by comma)?',
		default: false,
		isArray: true
	},
	'versions.version': {
		text: 'Widget version?',
		default: '1.0.0'
	},
	'versions.description': {
		text: 'Description?',
		default: 'no description'
	},
	'versions.source.name': {
		text: 'Which source system is used (one of the already existing in registry)?',
		default: false
	},
	'versions.source.url': {
		text: 'What is the URL o the source system?',
		default: 'https://'
	},
	'versions.source.auth': {
		text: 'Which authentication method should be used (one of supported by the source system)',
		default: false
	},
	'versions.assets.template': {
		text: 'Where the widget\'s template is located?',
		default: 'index.html'
	},
	'versions.assets.js': {
		text: 'Where the widget\'s core javascript file is located?',
		default: 'index.es6'
	},
	'versions.assets.readme': {
		text: 'Any readme to be used with the widget (MD syntax reaquired)?',
		default: false
	},
	'versions.assets.screenshots': {
		text: 'Any screenshots to be used?',
		default: false,
		isArray: true
	},
	[Symbol.iterator]: function* () {
		for (const key of Object.keys(this)) {
			yield [key, this[key]];
		}
	}
};