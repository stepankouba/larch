import readline from 'readline';

// temporary, to be set by larchRead
let questions;

// create readline interface from terminal
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * thunk for question method
 * @param  {string} t text to be shown as question
 * @return {Function}  function, which should be called with cb, which is passed to question method
 */
function ask(t) {
	return function(cb) {
		rl.question(t, cb);
	};
};

/**
 * perform the whole read.
 * Based on questions (create.widget.questions.es6) ask user via terminal and prepare output object, which is saved to the file
 *
 * @param {Object} questions Map of questions. See src/create.widget.questions.es6 for example file with detailed description
 * @return {Promise.<Object|Error>} resolving output object (Map) with keys, values
 */
function readInt() {
	const output = {};

	/**
	 * return value based on user's input, default value and parse it if array is expected
	 *
	 * @param  {string}  value          user's input
	 * @param  {*}  	 def            default value. If FALSE, then not use it
	 * @param  {Boolean} expectingArray is array is expected
	 * @return {*}       value
	 */
	function getValue(value, def, expectingArray = false) {
		let ret;

		if (value === '' && def !== false) {
			ret = def;
		} else {
			if (expectingArray) {
				ret = value.split(',');
			} else {
				ret = value;
			}
		}

		return ret;
	}

	/**
	 * function returning Generator object.
	 * Ask for a input from user and create output object
	 * @yield {string} string inserted by user
	 */
	function* gen() {
		// due to this loop, questions object has to implement Symbol.iterator
		for (const [k, val] of questions) {
			const question = (val.default !== false) ? `${val.text} (${val.default}) ` : `${val.text} `;

			// wait for answer
			const answer = yield ask(question);

			// create tree of objects based on the key structure (dot delimited string)
			const keys = k.split('.');
			// this uses reduce method with initial value set to output, so that even single item in array, will pass through this code
			keys.reduce((pr, cr, i, arr) => {
				pr[cr] = pr[cr] || {};

				// if it's last item in the array, replace {} with particular value
				if (i === arr.length - 1) {
					pr[cr] = getValue(answer, val.default, val.isArray);
				}

				return pr[cr];
			}, output);
		}
	}

	return new Promise((resolve, reject) => {
		const g = gen();

		function next(val) {
			const q = g.next(val);

			if (q.done) {
				rl.close();
				return resolve(output);
			}

			// call the returned function from ask()
			q.value(next);
		}

		next();
	});
};

export default function larchRead(qs) {
	questions = qs;

	return readInt;
}