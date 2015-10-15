import { EventEmitter } from 'events';
import { assign } from '../lib/lib.assign.es6';
import AppDispatcher from '../larch.dispatcher.es6';

const SourceMdlFn = function(User, SourceSrvc, Logger) {
	const logger = Logger.create('model.Sources');

	// create model object
	const SourceMdl = assign(EventEmitter.prototype, {
		cache: {},
		getAll() {
			if (Object.keys(SourceMdl.cache).length > 0) {
				SourceMdl.emit('sources.loaded', SourceMdl.cache);
			} else {
				logger.log('fetching sources from db');
				SourceSrvc.getAll()
					.then(results => {
						results.forEach(s => SourceMdl.cache[s.name] = s);
						SourceMdl.emit('sources.loaded', SourceMdl.cache);
					})
					.catch(err => {
						logger.error('error during fetching soruces', err);
						SourceMdl.emit('sources.loaded-not', err);
					});
			}
		}
	});

	AppDispatcher.register('Sources', 'sources.get-all', SourceMdl.getAll);

	return SourceMdl;
};
SourceMdlFn.$injector = ['model.User', 'service.Source', 'larch.Logger'];

export default {
	name: 'model.Sources',
	model: SourceMdlFn
};