export default {
	parse(str, retriever = undefined) {
		const r = retriever || function retriever(key, value) {
			if (typeof value === 'string' && value.startsWith('function ')) {
				/*eslint no-eval:0*/
				return eval(`(${value})`);
			} else {
				return value;
			}
		};

		return JSON.parse(str, r);
	},
	stringify(obj, replacer = undefined) {
		const r = replacer || function replacer(key, value) {
			if (typeof value === 'function') {
				return value.toString();
			} else {
				return value;
			}
		};

		return JSON.stringify(obj, r);
	}
};