import { Validator } from '../lib/index.es6';

export default {
	name(value) {
		return Validator.isDashSeparated(value);
	},
	title(value) {
		return Validator.isNotEmptyString(value);
	},
	authors(value) {
		return Validator.isArray(value);
	},
	tags(value) {
		return true;
	},
	shared(value) {
		return Validator.isShared(value);
	},
	versions: {
		version(value) {
			return Validator.isValidVersion(value);
		},
		description(value) {
			return true;
		},
		source: {
			name(value) {
				return Validator.isNotEmptyString(value);
			},
			url(value) {
				return Validator.isNotEmptyString(value);
			}
		},
		server: {
			requests: {
				path(value) {
					return Validator.isNotEmptyString(value);
				},
				method(value) {
					return Validator.isHTTPMethod(value);
				}
			}
		},
		assets: {
			template(value) {
				return Validator.isString(value);
			},
			readme(value) {
				return true; // Validator.isExistingFile(value);
			},
			screenshots(value) {
				return true; // Validator.areExistingFiles(value);
			}
		},
		client: {
			display: {
				width(value) {
					return Validator.isNumber(value);
				},
				height(value) {
					return Validator.isNumber(value);
				}
			}
		}
	}
};