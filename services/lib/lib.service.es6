/**
 * Service definition class
 * @author Stepan Kouba
 */
import express from 'express';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import Logger from './lib.logger.es6';
import Auth from './lib.service.auth.es6';
import Conf from './lib.service.conf.es6';
import fs from 'fs';

let logger;

let httpsKey;
let httpsCert;

/**
 * Service object
 * @type {Object}
 * @name  Service
 * @namespace
 */
const Service = {
	instance: {},
	/**
	 * create a new service object
	 * @param  {string} name name of the service
	 * @return {[type]}      [description]
	 */
	create(name) {
		const service = Object.create(Service.prototype);

		/**
		 * Short name
		 * @name Service.name
		 * @type {string}
		 */
		service.name = name;

		/**
		 * Full name
		 * @type {string}
		 * @name Sevice.fullname
		 */
		service.fullname = `${service.name}.service`;

		// create logger
		logger = Logger.create(service.fullname);

		// initiate instance
		Service.instance = service;

		return service;
	},
	prototype: {
		/**
		 * init server with all the middlewares, error handling and logging
		 */
		init(conf) {
			this.server = express();

			/**
			 * configuration object taken from master.services.json
			 * @type {Object}
			 * @name Service.conf
			 */
			this.conf = Conf.setConfiguration(conf);

			// logging of incomming requests
			// this.server.use(morgan('combined', {stream: logger.stream}));

			// receive JSON objects from body of requests
			this.server.use(bodyParser.json());

			this.server.use((req, res, next) => {
				// TODO: this Allow Origin has to be set correctly
				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3333');
				res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				next();
			});

			// allow using logger within services
			this.server.logger = logger;

			// import key and certificates
			/* eslint no-sync:false */
			httpsKey = fs.readFileSync('../larchservices-key.pem', 'utf8');
			httpsCert = fs.readFileSync('../larchservices-cert.pem', 'utf8');
		},
		/**
		 * start a service
		 * Just starts an express server on particular port
		 */
		run() {
			logger.info('port is: ', this.conf.port);

			const options = {
				key: httpsKey,
				cert: httpsCert
			};

			https.createServer(options, this.server).listen(this.conf.port);
			
			logger.info('service started', Date.now());
		},
		/**
		 * define routes before the service is started
		 *
		 * @typedef {Object} Route
		 * @property {string} path route path
		 * @property {string} httpMethod one of the HTTP allowed methods (GET, PUT, POST,...)
		 * @property {boolean} requiresAuth whether a path requires authentication
		 * @property {Function[]} middleware middlewares required for a path
		 *
		 * @param  {Route[]} routes array of route objects
		 */
		defineRoutes(routes) {
			const app = this.server;

			routes.forEach(route => {
				const method = route.httpMethod.toLowerCase();

				// prepend auth middlewares in case of secure APIs
				if (route.requiresAuth) {
					route.middleware.unshift(Auth.secure, Auth.isAuth);
				}

				// flatten array
				const args = [].concat([route.path, route.middleware]);

				if (app[method]) {
					app[method](...args);
				} else {
					logger.error('createRoutes has no method defined in app', route);
				}
			});

			// last error handler
			app.use(this._errorHandler());
		},
		/**
		 * internal service error handler for the APIs
		 * @return {Function} middleware
		 */
		_errorHandler() {
			return (err, req, res, next) => {
				// if development env, add the whole stack
				if (this.env === 'development') {
					err.fullError = err;
				}

				logger.error('error occured', err.stack ? err.stack : err);

				const responseCode = err.responseCode || 500;

				res.status(responseCode).json(err);
			};
		}
	}
};

export default Service;