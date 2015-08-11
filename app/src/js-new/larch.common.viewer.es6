'use strict';

let ViewerFn = function(HTTPer, Logger) {
	let logger = Logger.create('larch.Viewer');

	let Viewer = {
		views: [],
		parse() {
			let elems = document.querySelectorAll('[data-view]');

			Array.prototype.forEach.call(elems, item => {
				let templateId = item.getAttribute('data-view');

				this.getTemplate(templateId)
					.then(this._appendTemplate(item))
					.catch(err => logger.error(err));
			});
		},

		_getView(templateId) {
			return this.views.filter(item => item.templateUrl === templateId)[0];
		},

		_appendTemplate(item) {
			return function(data) {
				item.innerHTML = data;
			}
		},

		getTemplate(templateId) {
			let template = this._getView(templateId);

			if (template) {
				return Promise.resolve(template);
			} else {
				let url = window.location.origin + '/src/templates/' + templateId;

				return HTTPer.get(url)
					.then(data => {
						this.views.push({url: templateId, template: data});
						return Promise.resolve(data);
					});
			}
		},

		insert(templateId) {
			let elem = document.querySelector('[data-router]');
			let promise;

			return this.getTemplate(templateId)
				.then(this._appendTemplate(elem))
				.catch(err => logger.error(err));			
		}
	};

	return Viewer;
};
ViewerFn.$injector = ['larch.HTTPer', 'larch.Logger'];

export default ViewerFn;