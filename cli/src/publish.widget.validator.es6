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
			},
			auth(value) {
				return Validator.isNotEmptyString(value);
			}
		},
		assets: {
			template(value) {
				return Validator.isExistingFile(`${process.cwd()}/${value}`);
			},
			js(value) {
				return Validator.isExistingFile(`${process.cwd()}/${value}`);
			},
			readme(value) {
				return true; // Validator.isExistingFile(value);
			},
			screenshots(value) {
				return true; // Validator.areExistingFiles(value);
			}
		}
	}
};