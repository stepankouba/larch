/**
 * Rethinkdb logger for larch - this module is used by lib.logger
 * @author Stepan Kouba
 * @license MIT
 */
import winston from 'winston';
import RethinkDb from 'rethinkdbdash';

let r;

/**
 * RethinkLogger constructor used for Winston logger
 * DB and Collection have to exists already!!!!
 * 
 * @param {Object} options with following items
 * @param {string} options.host host specification
 * @param {number} options.port port specification
 * @param {string} [options.name='rethinkdb'] name of the logger
 * @param {string} [options.level] winston logger level 
 * @param {string} [options.collection] db collection to write in
 */
let RethinkLogger = function(options = {}) {
	this.options = Object.assign({}, options);

	this.name = this.options.name || 'rethinkdb';
	this.level = this.options.level || 'info';

	// create connection to db
	//r = RethinkDb({host: this.options.host, port: this.options.port});
	r = RethinkDb();
};
Object.setPrototypeOf(RethinkLogger, winston.Transport);

/**
 * Custom log function for winstor
 * @param  {string}   level    as the name indicates, level
 * @param  {string}   msg      message may be
 * @param  {string}   meta     :-)
 * @param  {Function} callback default callback function by winston
 */
RethinkLogger.prototype.log = function(level, msg, meta, callback) {
	// store in db
	r.db('larch_log').table('log')
		.insert({
			level: level,
			message: msg,
			timestamp: new Date(),
			metadata: meta
		}).run()
		.then(function() {
			callback(null, true);
		})
		.error(err => console.log(err));
};
//winston.transports.RethinkLogger = RethinkLogger;

export default RethinkLogger;