import JSONPath from 'JSONPath';

let methods;

function walk(data, path, result, key) {
	let fn;

	switch (type(path)) {
		case 'string':
			fn = seekSingle;
			break;
		case 'array':
			fn = seekArray;
			break;
		case 'object':
			fn = seekObject;
			break;
	}

	if (fn) {
		// if fn defined call it
		fn(data, path, result, key);
	} else {
		// if something else, just copy it to the results
		result[key] = path;
	}
}

function type(obj) {
	return Array.isArray(obj) ? 'array' : typeof obj;
}

function evaluate(data, path, customMethods) {
	const reg = /\(\*(.*)\)/i;
	const method = path.match(reg);
	let methodName;
	let seek;

	// check for custom method in the path
	if (method) {
		methodName = method[1];
		path = path.replace(reg, '');
	}
	seek = JSONPath.eval(data, path);

	return methodName ? customMethods[methodName](seek) : seek;
}

function seekSingle(data, pathStr, result, key) {
	// recognize path definition by first character
	if (['$', '#', '@', '.'].indexOf(pathStr[0]) > -1) {
		const seek = evaluate(data, pathStr, methods) || [];
		result[key] = seek.length ? seek[0] : undefined;
	} else {
		result[key] = pathStr;
	}
}

function seekArray(data, pathArr, result, key) {
	const subpath = pathArr[1];
	const path = pathArr[0];
	const seek = evaluate(data, path, methods) || [];

	if (seek.length && subpath) {
		result = result[key] = [];
		seek.forEach((item, index) => walk(item, subpath, result, index));
	} else {
		result[key] = seek;
	}
}

function seekObject(data, pathObj, result, key) {
	if (typeof key !== 'undefined') {
		result = result[key] = {};
	}

	Object.keys(pathObj).forEach(name => walk(data, pathObj[name], result, name));
}

/**
 * main transform function
 * @param  {Object|Array} data source data
 * @param  {Object|Array} path template of paths
 * @param  {Object} m    optional user methods
 * @return {Object|Array}     transformed result
 */
export default function(data, path, m = {}) {
	const pathIsArray = type(path) === 'array';
	let result;

	methods = m;

	if (pathIsArray) {
		result = [];
		path.forEach((p, i) => {
			result[i] = {};
			walk(data, p, result[i]);
		});
	} else {
		result = {};
		walk(data, path, result);
	}

	return result;
};