import dragula from 'dragula';

export default {
	init() {
		// add drag drop support
		dragula([document.getElementById('drag-drop-top'), document.getElementById('drag-drop-bottom')])
			.on('drop', (el, target, source, sibling) => {
				// dont remove headline :-)
				if (sibling && sibling.tagName !== 'H6') {
					source.appendChild(sibling);
				}

				if (this.onDropCb) {
					this.onDropCb(el, sibling);
				}
			});
		dragula([document.getElementById('drag-drop-middle')]);
	},
	/**
	 * use call back for on drop event
	 * @param  {Function} cb callback
	 */
	onDrop(cb) {
		this.onDropCb = cb;
	}
};