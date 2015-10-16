import JSONParser from '../jsonparser.es6';
import assert from 'assert';

const obj1 = {
	r: 1,
	t: {
		k: function k(v) {
			return v * 2;
		}
	}
};

const obj2 = {
	method(str) {
		return `test ${str}`;
	}
};

const str1 = `{"r":1,"t":{"k":"function k(v) {\\n\\t\\t\\treturn v * 2;\\n\\t\\t}"}}`;
const str2 = `{"method":"function method(str) {\\n\\t\\treturn \'test \' + str;\\n\\t}"}`;

assert.equal(JSONParser.stringify(obj1), str1);
assert.equal(JSONParser.stringify(obj2), str2);

assert.deepEqual(JSONParser.parse(str1).t.k(4), obj1.t.k(4));
assert.deepEqual(JSONParser.parse(str2).method('foo'), obj2.method('foo'));