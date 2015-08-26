/**
 * This is default logger for all services
 * @author Stepan Kouba
 * @license MIT
 */
import winston from 'winston';
import RethinkLogger from './lib.rethinklogger.es6';

const conf = require('./local.json');

// by default winston throw errors
winston.emitErrs = true;

// create new logger for RethinkDB and console
const logger = new winston.Logger({
	transports: [
		new RethinkLogger({
			db: conf.db.database,
			collection: conf.db.collection,
			host: conf.db.host,
			port: conf.db.port
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});

// add stream support for morgan
logger.stream = {
	/**
	 * write method for morgan use
	 * @param  {string} message  text
	 * @param  {string} encoding encoding
	 */
	write(message, encoding) {
		logger.info(message);
	}
};

export default logger;