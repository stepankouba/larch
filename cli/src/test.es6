import { LarchRegistry, LarchFS } from '../lib';
import logger from './logger.es6';
import express from 'express';
import restler from 'restler';
import { transform } from 'larch.lib';

function createHTML(widget) {
	return `
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>larch.cli testing site</title>
		<link rel="stylesheet" type="text/css" href="http://localhost:3333/build/css/larch.css">
	</head>
	<body>
		<div id="testing-chart" style="width: 700px; height: 400px;"></div>
	</body>
	<script type="application/json" id="widgetJSON">${JSON.stringify(widget)}</script>
	<script type="text/javascript">window.widget = JSON.parse(document.getElementById('widgetJSON').innerHTML);</script>
	<script src="http://localhost:3333/build/js/larch.test.chart.js"></script>
	</html>
	`;
}

const test = {
	subcommands: ['widget'],

	/**
	 * return string with help
	 * @return {string} help string
	 */
	usage() {
		const text = [
			'',
			'larch test <command> <args> runs a server to allow widget testing before passing it to the users',
			'',
			'\tAvailable commands are:',
			'\twidget - for testing a widget definition file',
			'',
			'\tAvailable args is:',
			''].join('\n');

		return text;
	},

	invoke(subcommand, args) {
		let widget;
		const currentDir = process.cwd();
		const settingsFile = args[1] || false;

		const server = express();
		server.use((req, res, next) => {
			// TODO: this Allow Origin has to be set correctly
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
			res.setHeader('Access-Control-Allow-Credentials', 'true');
			next();
		});

		// server.use('node_modules', express.static(`${__dirname}/../node_modules`));
		// server.use('node_modules/babel', express.static(`${__dirname}/../node_modules/babel`));
		// server.use(express.static(`${__dirname}`));

		server.get('/', (req, res) => {
			let rawData;
			try {
				widget = require(`${currentDir}/larch.package.json`);
			} catch (e) {
				return logger.error('larch.package.json or test.data.json was not found in this directory');
			}

			// load index.es6 into version definition
			widget.version = LarchRegistry.loadIndex(currentDir);

			// get data from
			if (!settingsFile) {
				rawData = require(`${currentDir}/test.data.json`);

				if (widget.version.transform) {
					widget.data = transform(rawData, widget.version.transform.template, widget.version.transform.methods);
				} else {
					widget.data = rawData;
				}

				res.send(createHTML(widget));

			} else {
				let settings;
				let rc;

				try {
					settings = require(`${currentDir}/${settingsFile}`);
					rc = LarchFS.loadConfig(`${currentDir}/.larchrc`);
					if (!rc.token) {
						throw new Error('no token');
					}
				} catch (e) {
					logger.error('user is not logged in. Use larch login command before larch publish');
				}

				const data = {
					widget,
					security: {
						token: settings.token
					},
					settings
				};

				restler.postJson(`https://localhost:9101/api/data/testing-id`, data, {accessToken: rc.token})
					.on('complete', (result, response) => {
						if (result instanceof Error || response.statusCode > 399) {
							return res.json({responseCode: 404, msg: 'some proble retrieving info from server'});
						}

						widget.data = result;

						res.send(createHTML(widget));
					});

			}
		});

		server.listen(9999);
		console.log('testing server is running on port 9999\ntry http://localhost:9999/ in your browser');

	}
};

export default test;