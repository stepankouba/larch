'use strict';

import DateTime, StringHelper from '../larch.common.lib.es6';

let decorator = function($provide) {

	let delegate = function($delegate) {
		// Save the original $log.debug()
		var debugFn = $delegate.debug;
		
		$delegate.debug = function(...args) {
			let now = DateTime.now();
			
			// Prepend timestamp
			args[0] = StringHelper.replacer(`${values[0]} - ${values[1]}`, now, args[0]);
			
			// Call the original with the output prepended with formatted timestamp
			debugFn.apply(null, args);
		};
		
		return $delegate;
	};


	$provide.decorator( '$log', delegate);
};

decorator.$inject = ['$provide'];

exports default decorator;