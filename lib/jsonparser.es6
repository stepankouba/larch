export default {
	/**
	 * evaluate all the object keys - no deep eval
	 * @param  {Object} obj hash with strings as values to be eval
	 * @return {Object}
	 */
	evaluate(obj) {
		const val = {};
		Object.keys(obj).forEach(k => {
			/* esling no-eval:0 */
			val[k] = eval(`(${obj[k]})`);
		});

		return val;
	},
	/**
	 * parse JSON with function in text
	 * @param  {String} str       JSON
	 * @param  {Function} [retriever = undefined] custom function
	 * @return {Object}  result
	 */
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
	/**
	 * stringify using a default replacer converting functions to string and removing \n \t \r chars
	 * @param  {Object} obj      Object to be stringified
	 * @param  {Function} [replacer=undefined] custom function, default used if not specified
	 * @return {String}
	 */
	stringify(obj, replacer = undefined) {
		const r = replacer || function replacer(key, value) {
			if (typeof value === 'function') {
				return value.toString().replace(/\t|\n|\r/g, '');
			} else {
				return value;
			}
		};

		return JSON.stringify(obj, r);
	}
};