import fs from 'fs';

const FILE_NAME = './larch.package.json';

/**
 * check if larch.package.json exists
 * @return {Promise.<Boolean|Error>}
 */
export function fileExisting(fileName = FILE_NAME) {
	return function fileExistingInt() {
		return new Promise((resolve, reject) => {
			fs.stat(fileName, (err, f) => {
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
	};
};

/**
 * save output object into file
 * @param  {Object} output Object created by read function
 * @return {Promise.<Boolean|Error>}
 */
export function save(fileName = FILE_NAME) {
	return function saveInt(output) {
		return new Promise((resolve, reject) => {
			fs.writeFile(fileName, JSON.stringify(output, null, 4), err => {
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	};
};