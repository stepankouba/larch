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
				params.unshift(Date.now(), ' - ', this.ns, ' - ');

				console[type].apply(console, params);
			},
			log: function loggerLog(params){
				this._output('log', Array.prototype.slice.call(arguments));
			},
			error: function loggerError(params) {
				this._output('error', Array.prototype.slice.call(arguments));
			},
			info: function loggerError(params) {
				this._output('info', Array.prototype.slice.call(arguments));
			},
			warning: function loggerWarning(params) {
				this._output('warn', Array.prototype.slice.call(arguments));
			}
		}
	};

	return Logger;
};

export default LoggerFn;