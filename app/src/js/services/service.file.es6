let conf = require('../../master.app.json');

let FilesSrvc = function(HTTPer, Logger) {
	let logger = Logger.create('service.File');

	let srvc = {
		getFile(path, json = false) {
			return HTTPer.get(path, {json});
		}
	};

	return srvc;
}
FilesSrvc.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
		name: 'service.File',
		type: 'singleton',
		functor: FilesSrvc
	};