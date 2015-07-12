'use strict';

import LWidget from './ui.widget.class.es6';

let WidgetFctr = function($log, WidgetSrvc, FilesSrvc) {
	let log = $log.getLogger('WidgetFctr');

	return function(id) {
		let userParams;

		return WidgetSrvc.getById(id)
			.then(data => {
				// get widget settings
				userParams = data.params;
				
				return FilesSrvc.getFile('./../larch_modules/' + data.type + '/index.js');
			})
			.then(file => {
				// get the definition
				let w = eval(file);

				return new LWidget(w, userParams);
			});
	};
}
WidgetFctr.$inject = ['$log', 'WidgetSrvc', 'FilesSrvc'];

export default WidgetFctr;