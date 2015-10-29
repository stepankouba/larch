// import Handlebars from '../common/common.handlebars.es6';

const ModalFn = function(Viewer, Logger) {
	const logger = Logger.create('component.Modal');
	const Modal = {
		create(modalName) {
			const m = Object.create(Modal.prototype);

			m.name = modalName;
			m.viewId = `ui.modal.${m.name}`;

			return m;
		},
		prototype: {
			instance: undefined,
			element: undefined,
			container: undefined,
			/**
			 * load required template
			 * @return {[type]} [description]
			 */
			open() {
				logger.info(`open ${this.name} modal`);

				this.container = document.querySelector('#modal-div');
				const view = Viewer.processView(this.container, this.viewId);

				// store link to modal for the view
				view.scope.modal = this;
				// use default close method for ESC key pressed event
				this._closeMethod = view.methods.close;

				this.display();

				this._toggleClassOnId('content-wrapper', 'larch-modal-open');

				return new Promise((resolve, reject) => {
					this.resolve = resolve;
					this.reject = reject;

					this._run(resolve, reject);
				});
			},
			_toggleClassOnId(id, className) {
				document.getElementById(id).classList.toggle(className);
			},
			display() {
				// this.element.classList.add('show');
				this.element = this.container.firstElementChild;
				this.element.style.display = 'block';
			},
			/**
			 * remove modal from DOM
			 */
			hide() {
				this.element.style.display = 'none';
				this.container.innerHTML = '';
				this._toggleClassOnId('content-wrapper', 'larch-modal-open');
			},
			/**
			 * prepare modal before usage
			 * @param  {Function} resolve Promise resolve
			 * @param  {Function} reject  Promise rejection
			 */
			_run(resolve, reject) {
				const self = this;
				this._addEventListeners('[data-dismiss]','click', e => {
					e.preventDefault();
					this.hide();
					reject('stopped');
				});

				this._addEventListeners('[data-save]', 'click', e => {
					e.preventDefault();
					this.hide();
					resolve('yeah');
				});

				// default modal esc keyup handler
				const keyHandler = e => {
					if (e.keyCode === 27) {
						// call default close method
						return self._closeMethod(e);
					}
				};
				document.addEventListener('keyup', keyHandler);
			},
			/**
			 * add event listeners required by modal component to the modal elements
			 * @param {string} selector css3 selector of element
			 * @param {string} type     event name
			 * @param {Function} handler
			 */
			_addEventListeners(selector, type, handler) {
				const els = this.element.querySelectorAll(selector);
				[].forEach.call(els, el => {
					el.addEventListener(type, handler);
				});
			},

		}
	};

	return Modal;
};
ModalFn.$injector = ['larch.Viewer', 'larch.Logger'];

export default {
	name: 'component.Modal',
	type: 'class',
	functor: ModalFn
};