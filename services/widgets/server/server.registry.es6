import RethinkDb from 'rethinkdbdash';
import semver from 'semver';
// import fs from 'fs';
// import zlib from 'zlib';
// import tar from 'tar';
// import path from 'path';

import { Service } from '../../lib/';

const r = RethinkDb();

const Registry = {
	// REGISTRY_PATH: path.resolve(`${__dirname}/../registry`),
	/**
	 * request DB whether a widget is already in Registry
	 * @param  {Object} widget widget object
	 * @return {Promise.<Object[]|Error>} array of objects
	 */
	_requestDB(widget) {
		const conf = Service.instance.conf;
		const name = widget.name;

		return new Promise((resolve, reject) => {
			r.db(conf.db.database)
				.table('widgets')
				.filter({name})
				.then(result => resolve([widget, result]))
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});

	},
	/**
	 * test if widget, which was sent, is in DB and if, test the proper version
	 * The newest version has to be a first item in versions property
	 * @param  {Object[]} result array of objects
	 * @return {Promise.<boolean|Error>} indication whether, widget in it's version is already in Registry
	 */
	_isWidgetInRegistry([widget, result]) {
		return new Promise((resolve, reject) => {
			if (result.length === 0) {
				return resolve([widget, {}]);
			}

			// if widget exists in db, compare versions, if greater in JSON proceed, if not exit
			if (semver.gt(widget.version.version, result[0].versions[0].version)) {
				return resolve([widget, result[0]]);
			} else {
				return reject(new Error('RegistryWidget: send version which is not greater than existing one'));
			}
		});
	},
	_saveToRegistry([widget, currentWidget]) {
		const conf = Service.instance.conf;

		function copyProps(source, target) {
			target.title = source.title;
			target.shared = source.shared;
			target.tags = source.tags;
			target.authors = source.authors;
		}

		return new Promise((resolve, reject) => {
			const newHasToBeInserted = Object.keys(currentWidget).length === 0;

			if (newHasToBeInserted) {
				// this replaces versions key from send json with array
				// which is then used
				currentWidget = Object.create({});
				currentWidget.name = widget.name;
				currentWidget.versions = [];
			}

			copyProps(widget, currentWidget);
			currentWidget.versions.unshift(widget.version);

			r.db(conf.db.database)
				.table('widgets')
				.insert(currentWidget, {conflict: 'replace'})
				.then(result => resolve(result))
				.catch(err => reject(err));
			// .finally(() => r.getPool().drain());
		});
	},
	postWidget(widget) {
		// get JSON from body and file
		return Registry._requestDB(widget)
			.then(Registry._isWidgetInRegistry)
			// TODO: check wether only owner is updating the widget
			.then(Registry._saveToRegistry);
	}
};

export default Registry;