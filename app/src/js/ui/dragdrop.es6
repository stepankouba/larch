import dragula from 'dragula';

export default {
	init() {
		// add drag drop support
		dragula([document.getElementById('drag-drop-top'), document.getElementById('drag-drop-bottom')])
			.on('drop', (el, target, source, sibling) => {
				source.appendChild(sibling);
			});
		dragula([document.getElementById('drag-drop-middle')]);
	}
};