const UI = {
	showOption(e, option) {
		e.preventDefault();

		// if option is link, open new window
		if (option.startsWith('http')) {
			return window.open(option, `larch_window`);
		}

		// un-highlight previously selected
		const d = document.querySelector(`.modal-detail:not(.hidden)`);
		if (d) {
			d.classList.toggle('hidden');
		}

		// display detail
		const el = document.querySelector(`#modal-detail-${option}`);
		el.classList.toggle('hidden');

		// un-highlight previously selected
		const s = document.querySelector(`.modal-option.selected`);
		if (s) {
			s.classList.remove('selected');
		}

		// select option
		const div = document.querySelector(`#modal-option-${option}`);
		div.classList.toggle('selected');
	},
	displayWidgetError(id, err) {
		const loader = document.querySelector(`[id="container-widget${id}"] > .loader`);

		loader.innerHTML = err;
	},
	removeLoader(parentElementSelector) {
		const loader = document.querySelector(`${parentElementSelector} > .loader`);

		if (loader) {
			document.querySelector(parentElementSelector)
			.removeChild(loader);
		}
	},
};

export default UI;