const UI = {
	showOption(e, option) {
		e.preventDefault();

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
	}
};

export default UI;