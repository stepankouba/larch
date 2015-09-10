import fs from 'fs';
import tar from 'tar';
import fstream from 'fstream';
import zlib from 'zlib';

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

export function createGzip(dir) {
	return new Promise((resolve, reject) => {
		const gzip = zlib.createGzip();

		const packer = tar.Pack({ noProprietary: true })
			.on('error', err => reject(err));

		// This must be a "directory"
		const fstr = fstream.Reader({ path: dir, type: 'Directory' })
			.on('error', err => reject(err));

		const gzipDest = fs.createWriteStream(`${dir}/larch.package.tar.gz`)
			.on('finish', () => {
				resolve(`${dir}/larch.package.tar.gz`);
			});

		fstr.pipe(packer)
			.pipe(gzip)
			.pipe(gzipDest);
	});
};
