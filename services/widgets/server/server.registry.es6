import RethinkDb from 'rethinkdbdash';
import semver from 'semver';
import fs from 'fs';
import zlib from 'zlib';
import tar from 'tar';
import path from 'path';

import { Service } from '../../lib/';

const r = RethinkDb();

const Registry = {
	REGISTRY_PATH: path.resolve(`${__dirname}/../registry`),
	json: undefined,
	file: undefined,
	/**
	 * request DB whether a widget is already in Registry
	 * @param  {String} name name of the widget
	 * @return {Promise.<Object[]|Error>} array of objects
	 */
	_requestDB(name) {
		const conf = Service.instance.conf;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('widgets')
				.filter({name})
				.then(result => resolve(result))
				.error(err => reject(err));
		});

	},
	/**
	 * test if widget, which was sent, is in DB and if, test the proper version
	 * The newest version has to be a first item in versions property
	 * @param  {Object[]} result array of objects
	 * @return {Promise.<boolean|Error>} indication whether, widget in it's version is already in Registry
	 */
	_isWidgetInRegistry() {
		function isWidgetInRegistry(result) {
			return new Promise((resolve, reject) => {
				if (result.length === 0) {
					this.newHasToBeInserted = true;
					return resolve(false);
				}

				this.newHasToBeInserted = false;
				this.currentId = result[0].id;

				// if widget exists in db, compare versions, if greater in JSON proceed, if not exit
				if (semver.gt(this.json.versions.version, result[0].versions[0].version)) {
					return resolve(true);
				} else {
					return reject(new Error('RegistryWidget: send version which is not greater than existing one'));
				}
			});
		};

		return isWidgetInRegistry.bind(Registry);
	},
	/**
	 * create dir only if not existing alreadys
	 * @param  {Boolean} isInRegistry true if the widget is already in Registry
	 * @return {Promise.<boolean|Error>}
	 */
	_createDir() {
		function createDir(isInRegistry) {
			return new Promise((resolve, reject) => {

				// if directory not existing, create it
				if (!isInRegistry) {
					fs.mkdir(`${this.REGISTRY_PATH}/${this.json.name}/`, err => {
						if (err) {
							return reject(err);
						} else {
							return resolve(true);
						}
					});
				}

				return resolve(true);
			});
		}

		return createDir.bind(Registry);
	},
	/**
	 * extract tar.gz into directory
	 * @return {Promise.<boolean|Error>} indication, when the tar.gz is extracted
	 */
	_saveToDir() {
		function saveToDir() {
			return new Promise((resolve, reject) => {
				const version = this.json.versions.version;
				// save to file
				const dest = `${this.REGISTRY_PATH}/${this.json.name}/${version}/`;
				const gzip = zlib.createGunzip();

				const file = fs.createReadStream(this.file.path)
					.on('error', err => reject(err));

				const extractor = tar.Extract({path: dest})
					.on('end', () => resolve(true))
					.on('error', err => reject(err));

				file.pipe(gzip).pipe(extractor);
			});
		}

		return saveToDir.bind(Registry);
	},
	_saveToRegistry() {
		function saveToRegistry() {
			const conf = Service.instance.conf;

			return new Promise((resolve, reject) => {
				if (this.newHasToBeInserted) {
					r.db(conf.db.database)
						.table('widgets')
						.insert(this.json)
						.then(result => resolve(result))
						.error(err => reject(err));
				} else {
					// r.db(conf.db.database)
					// 	.table('widgets')
					// 	.get(this.currentId)
					// 	.update({versions: r.row('versions').prepend(this.json)})
					// 	.then(result => resolve(result))
					// 	.error(err => reject(err));
				}
			});
		}

		return saveToRegistry.bind(Registry);
	},
	_postWidget(req, res, next) {
		if (!req.body.data) {
			return next(new Error('postWidget: no data specified'));
		}

		// get JSON from body and file
		this.json = JSON.parse(req.body.data);
		this.file = req.file;

		this._requestDB(this.json.name)
			.then(this._isWidgetInRegistry())
			.then(this._createDir())
			.then(this._saveToDir())
			.then(this._saveToRegistry())
			.then(result => res.json({value: 'OK'}))
			.catch(err => next(err));
	},
	postWidget() {
		return Registry._postWidget.bind(Registry);
	}
};

export default Registry;