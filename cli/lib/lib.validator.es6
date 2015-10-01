import semver from 'semver';
import fs from 'fs';

function returnResult(test, errMsg, value) {
	if (test) {
		return true;
	} else {
		return new Error(`${errMsg} (${value})`);
	}
}

export function isDashSeparated(value) {
	const test = /^[A-Za-z0-9]+([-]{0,1}[A-Za-z0-9]+)+$/.test(value);

	return returnResult(test, 'value is not dash-separated-text', value);
}

export function isString(value) {
	const test = typeof value === 'string';

	return returnResult(test, 'value is not a string', value);
}

export function isNotEmptyString(value) {
	const test = isString(value) && isNotEmpty(value);

	return returnResult(test, 'value is an empty string', value);
}

export function isNotEmpty(value) {
	const test = isString(value) ? value.trim().length > 0 : value.length > 0;

	return returnResult(test, 'value is empty', value);
}

export function isArray(value) {
	return returnResult(Array.isArray(value), 'value is empty', value);
}

export function isNumber(value) {
	return Number.isInteger(value);
}

export function isShared(value) {
	return ['private', 'publich', ''].indexOf(value) > -1;
}

export function isValidVersion(value) {
	return returnResult(semver.valid(value), 'value is not valid version', value);
}

export function isHTTPMethod(value) {
	return ['get', 'post', 'put'].indexOf(value) > -1;
}

export function isExistingFile(value) {
	/*eslint no-sync:0*/
	const test = fs.statSync(`${value}`);

	return returnResult(test.isFile(), 'provided is not existing file', value);
}

export function areExistingFiles(value) {
	const test = isArray(value);

	if (test === true) {
		return true;
	} else {
		return returnResult(false, 'value is not an array', value);
	}
}