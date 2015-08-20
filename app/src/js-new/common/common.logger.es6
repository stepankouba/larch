'use strict';

let LoggerFn = function() {
	let Logger = {
		create: function loggerCreate(ns){
			var logger = Object.create(Logger.prototype);
			logger.ns = ns;

			return logger;
		},
		prototype: {
			_output: function loggerOutput(type, params){
				if (!console[type]) {
					throw new Error('larch.Logger console output not suported');
				}

				// add time and namespace
				params.unshift(`${new Date()}: ${this.ns}: `);

				console[type].apply(console, params);
			},
			log: function loggerLog(params){
				this._output('log', [].slice.call(arguments));
			},
			error: function loggerError(params) {
				this._output('error', [].slice.call(arguments));
			},
			info: function loggerError(params) {
				this._output('info', [].slice.call(arguments));
			},
			warning: function loggerWarning(params) {
				this._output('warn', [].slice.call(arguments));
			}
		}
	};

	return Logger;
};

export default LoggerFn;