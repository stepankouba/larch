const WIDGET_WIDTH = 3;

export default class LBoard {
	constructor(dash) {
		this.db = dash;
	}

	/**
	 * [getRow description]
	 * @param  {[type]} rowNum [description]
	 * @return {[type]}        [description]
	 */
	getRow(rowNum) {
		// return widtger for particular row
	}

	/**
	 * [getRows description]
	 * @return {[type]} [description]
	 */
	getRows() {
		let result = {};

		// count rows in 
		this.db.widgets.forEach(item => {
			let row = item.y.toString();

			if (row in result) {
				result[row]++;
			} else {
				result[row] = 1;
			}
		});

		return result;
	}

	/**
	 * [getWidgets description]
	 * @return {[type]} [description]
	 */
	getWidgets() {
		
		return this.db.widgets.map(item => {
			item.width = item.w * WIDGET_WIDTH;
			item.height = item.h;

			return item; 
		});
	}
}