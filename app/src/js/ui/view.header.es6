// import AppDispatcher from '../../larch.dispatcher.es6';

const ctrl = function(HTTPer, Modal, Logger) {
	const logger = Logger.create('ui.header');

	// define operations used in template
	this.methods = {
		authNewSource(e, ...val) {
			e.preventDefault();
			logger.info('new source auth started');

			const w = window.open('about:blank', 'larch_auth_source', 'height=800, width=1000, top=500, left=200, scrollable=yes, menubar=yes, resizable=yes');

			HTTPer.get('https://localhost:9101/api/user/auth/source/lo-github', {json: true})
				.then(data => {
					logger.log('received data', data);
					w.location = data.url;
					w.focus();
				})
				.catch(err => logger.error(err));

			return false;
		},
		openEdit(e) {
			e.preventDefault();
			logger.info('opening edit modal');

			const m = Modal.create('edit');

			m.open()
				.then(result => {
					logger.log(result);
				})
				.catch(err => logger.error(err));

		}
	};

};
ctrl.$injector = ['larch.HTTPer', 'component.Modal', 'larch.Logger'];

const View = {
	id: 'ui.header',
	templateUrl: './ui/header.html',
	scope: {},
	methods: {},
	controller: ctrl
};

export default View;