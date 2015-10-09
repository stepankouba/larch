import { LarchRegistry } from '../lib';
import logger from './logger.es6';
import express from 'express';
import path from 'path';

const test = {
	subcommands: ['widget', 'source'],
	argsLength: 0,

	/**
	 * return string with help
	 * @return {string} help string
	 */
	usage() {
		const text = [
			'',
			'larch test <command> runs a server to allow ',
			'\tAvailable commands are:',
			'\twidget - for testing a widget definition file',
			'\tsource - for tsting a source system definition file',
			''].join('\n');

		return text;
	},

	invoke(subcommand, args) {
		let widget;
		const currentDir = process.cwd();

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
		server.use(express.static(`${__dirname}`));

		server.get('/', (req, res) => {
			try {
				widget = require(`${currentDir}/larch.package.json`);
				widget.data = require(`${currentDir}/test.data.json`);
			} catch (e) {
				logger.error('larch.package.json was not found in this directory');
			}

			// load index.es6 into version definition
			widget.version = LarchRegistry.loadIndex(currentDir);

			const html = `
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
			<script type="text/javascript">
				window.widget = JSON.parse('${JSON.stringify(widget)}');
			</script>
			<script src="http://localhost:3333/build/js/larch.test.chart.js"></script>
			<div id="modal-div">
			</div>
			</html>
			`;

			res.send(html);
		});

		server.listen(9999);
		console.log('testing server is running on port 9999\ntry http://localhost:9999/ in your browser');

	}
};

export default test;