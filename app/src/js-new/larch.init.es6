'use strict';

let init = function(Logger, HTTPer) {
	let logger = Logger.create('app.init');
};
init.$injector = ['larch.Logger', 'larch.HTTPer'];

export default init;