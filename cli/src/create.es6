import readline from 'readline';
import fs from 'fs';
import questions from './create.widget.questions.es6';

// create readline interface from terminal
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const FILE_NAME = './larch.package.json';

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
 * @return {Promise.<Object|Error>} resolving output object (Map) with keys, values
 */
function read() {
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
}

/**
 * save output object into file
 * @param  {Object} output Object created by read function
 * @return {Promise.<Boolean|Error>}
 */
function save(output) {
	return new Promise((resolve, reject) => {
		fs.writeFile(FILE_NAME, JSON.stringify(output, null, 4), err => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}

/**
 * check if larch.package.json exists
 * @return {Promise.<Boolean|Error>}
 */
function fileExisting() {
	return new Promise((resolve, reject) => {
		fs.stat(FILE_NAME, (err, f) => {
			if (err) {
				if (err.code === 'ENOENT') {
					return resolve(false);
				} else {
					return reject(err);
				}
			}

			if (f.isFile()) {
				return reject(`larch ERR: ${FILE_NAME} already exists, please modify it manually or delete it to create new one`);
			}
		});
	});
}

const create = {
	subcommands: ['widget', 'source'],
	argsLength: 0,

	/**
	 * return string with help
	 * @return {string} help string
	 */
	usage() {
		const text = [
			'',
			'larch create <command> creates a larch.package.json',
			'\tAvailable commands are:',
			'\twidget - for creating new widget definition file',
			'\tsource - for creating new source system definition file',
			''].join('\n');

		return text;
	},

	/**
	 * invoke create command
	 * @param  {string} subcommand either 'widget' or 'source'
	 * @param  {Array}  args       any other arguments (no used in create)
	 */
	invoke(subcommand, args = []) {
		// test the subcommand
		if (!subcommand || this.subcommands.indexOf(subcommand) === -1) {
			console.log(this.usage());
			process.exit();
		}

		fileExisting()
			.then(read)
			.then(save)
			.then(() => {
				process.exit();
			})
			.catch(err => {
				console.log(err);
				process.exit();
			});
	}
};

export default create;