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

		// initiate instance
		Service.instance = service;

		Service.Auth = Auth;

		return service;
	},
	prototype: {
		/**
		 * init server with all the middlewares, error handling and logging
		 * @param  {[type]} conf     [description]
		 * @param  {Object} rcConfig [description]
		 * @return {[type]}          [description]
		 */
		init(conf, rcConfig = { bodyParser: true }) {
			this.server = express();

			// create logger
			this.server.logger = logger = Logger.create(this.fullname);

			/**
			 * configuration object taken from master.services.json
			 * @type {Object}
			 * @name Service.conf
			 */
			this.conf = Conf.setConfiguration(conf);

			Service.Auth.init(this.conf.env);

			// logging of incomming requests
			this.server.use(morgan('combined', {stream: this.server.logger.stream}));

			// receive JSON objects from body of requests
			if (rcConfig.bodyParser) {
				this.server.use(bodyParser.json());
			}

			this.server.use((req, res, next) => {
				// TODO: this Allow Origin has to be set correctly
				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3333');
				res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				next();
			});
		},
		/**
		 * start a service
		 * Just starts an express server on particular port
		 */
		run() {
			logger.info('port is: ', this.conf.port);

			// last error handler
			this.server.use(this._errorHandler());

			if (this.conf.ssl) {
				/* eslint no-sync:false */
				// import key and certificates
				const options = {
					key: fs.readFileSync('../larchservices-key.pem', 'utf8'),
					cert: fs.readFileSync('../larchservices-cert.pem', 'utf8')
				};

				https.createServer(options, this.server).listen(this.conf.port);
			} else {
				http.createServer(this.server).listen(this.conf.port);
			}
			
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
		},
		/**
		 * internal service error handler for the APIs
		 * @return {Function} middleware
		 */
		_errorHandler(optMsg = undefined) {
			return (err, req, res, next) => {
				logger.error('error occured', err.stack ? err.stack : err);

				const responseCode = err.responseCode || 500;
				const msg = err.msg || optMsg || err;
				
				res.status(responseCode).json({responseCode, msg});
			};
		}
	}
};

export default Service;