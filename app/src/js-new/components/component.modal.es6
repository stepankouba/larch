import Handlebars from '../common/common.handlebars.es6';

let ModalFn = function(HTTPer, Logger){
	let logger = Logger.create('component.Modal');
	let Modal = {
		create() {
			let m = Object.create(Modal.prototype);

			return m;
		},
		prototype: {
			instance: undefined,
			element: undefined,
			container: undefined,
			open() {
				// TODO: make a cache od modals
				return HTTPer.get(window.location.origin + '/build/templates/ui/modal/modal.html')
					.then(data => {
						let template = data;
						this.container = document.querySelector('#modal-div');
						this.container.innerHTML = data;
						this.element = 	this.container.firstElementChild;
						
						this.element.classList.add('show');
						this.element.style.display = 'block';
						
						// TODO: this disables scrolling based on bootstrap, but not working yet
						document.getElementById('page-wrapper').classList.toggle('larch-modal-open');
						//document.getElementById('content-wrapper').classList.toggle('modal-open');

						return Promise.resolve(true);
					})
					.then(() => {
						return new Promise((resolve, reject) => {
							this._run(resolve, reject);
						});
					});
			},
			hide() {
				this.element.style.display = 'none';
				this.container.innerHTML = '';
				document.getElementById('page-wrapper').classList.toggle('larch-modal-open');
			},
			_run(resolve, reject) {
				this._addEventListeners('[data-dismiss]','click', e => {
					e.preventDefault();
					this.hide();
					reject('stopped');
				});

				this._addEventListeners('[data-save]', 'click', e => {
					e.preventDefault();
					this.hide();
					resolve('yeah');
				})
			},
			_addEventListeners(selector, type, handler) {
				let els = this.element.querySelectorAll(selector);
				[].forEach.call(els, el => {
					el.addEventListener(type, handler);
				});	
			},

		}
	};

	return Modal;
};
ModalFn.$injector = ['larch.HTTPer', 'larch.Logger'];

export default {
	name: 'component.Modal',
	type: 'class',
	functor: ModalFn
};