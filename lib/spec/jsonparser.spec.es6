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

const obj3 = {
	round: function round(_ref) {var _ref2 = _slicedToArray(_ref, 1);var value = _ref2[0];return [Math.round(value.total / value.days.length * 100) / 100];}
};

const str1 = `{"r":1,"t":{"k":"function k(v) {return v * 2;}"}}`;
const str2 = `{"method":"function method(str) {return \'test \' + str;}"}`;

const str3 = { round: 'function round(_ref) {var _ref2 = _slicedToArray(_ref, 1);var value = _ref2[0];return [Math.round(value.total / value.days.length * 100) / 100];}' };

assert.equal(JSONParser.stringify(obj1), str1);
assert.equal(JSONParser.stringify(obj2), str2);

assert.deepEqual(JSONParser.parse(str1).t.k(4), obj1.t.k(4));
assert.deepEqual(JSONParser.parse(str2).method('foo'), obj2.method('foo'));

assert.deepEqual(JSONParser.stringify(JSONParser.evaluate(str3).round), JSONParser.stringify(obj3.round));