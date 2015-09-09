// possible values: DEBUG, PROD
const logLevels = {
	DEBUG: 0,
	PROD: 1
};

const Logger = {
	create(level) {
		const logger = Object.create(Logger.prototype);

		logger.level = logLevels[level] || logLevels.DEBUG;
		logger.ns = 'cli';

		return logger;
	},
	prototype: {
		_output(type, params) {
			if (!console[type]) {
				throw new Error('Logger console output not suported');
			}

			// add time and namespace
			params.unshift(`${this.ns}: `);

			console[type](...params);
		},
		log(...params) {
			if (this.level === logLevels.DEBUG) {
				this._output('log', params);
			}
		},
		error(...params) {
			this._output('error', params);
		},
		info(...params) {
			this._output('info', params);
		},
		warning(...params) {
			if (this.level === logLevels.DEBUG) {
				this._output('warn', params);
			}
		}
	}
};

export default Logger.create('DEBUG');