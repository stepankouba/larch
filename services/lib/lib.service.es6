/**
 * Service definition class
 * @author Stepan Kouba
 */
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './lib.logger.es6';
import Auth from './lib.service.auth.es6';

const conf = require('../master.services.json');

/**
 * Service object
 * @type {Object}
 * @name  Service
 * @namespace
 */
const Service = {
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

		/**
		 * configuration object taken from master.services.json
		 * @type {string}
		 * @name Service.conf
		 */
		service.conf = conf.services[name] || {port: 9999};

		return service;
	},
	prototype: {
		/**
		 * init server with all the middlewares, error handling and logging
		 */
		init() {
			this.server = express();

			// receive JSON objects from body of requests
			this.server.use(bodyParser.json());

			this.server.use((req, res, next) => {
				// TODO: this Allow Origin has to be set correctly
				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3333');
				res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
				res.setHeader('Access-Control-Allow-Credentials', 'true');
				next();
			});

			// logging of incomming requests
			this.server.use(morgan('dev', {stream: logger.stream}));

			this.server.use(this._errorHandler);
		},
		/**
		 * start a service
		 * Just starts an express server on particular port
		 */
		run() {
			this.server.listen(this.conf.port);
			logger.info(this.fullname, ': service started');
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
		 *
		 * @param  {err}   err  error if defined
		 * @param  {Object}   req  request object
		 * @param  {Object}   res  response object
		 * @param  {Function} next next function
		 */
		_errorHandler(err, req, res, next) {
			const error = {error: 'error occured'};

			logger.error(this.fullname, ': ', err);

			// if development env, add the whole stack
			if (process.env.NODE_ENV === 'development') {
				error.fullError = err;
			}

			res.status(500).json(error);
		}
	}
};

export default Service;