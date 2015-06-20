'use strict';

import { DateTime, StringHelper } from '../common.lib.es6';

let decorator = function($provide) {

	let delegate = function($delegate) {
		// Save the original $log.debug()
		var debugFn = $delegate.debug;
		
		$delegate.debug = function(...args) {
			let now = DateTime.dateToString();
			
			// Prepend timestamp
			args[0] = `${now} - ${args[0]}`;
			
			// Call the original with the output prepended with formatted timestamp
			debugFn.apply(null, args);
		};
		
		return $delegate;
	};
	delegate.$inject = ['$delegate'];
	
	
	$provide.decorator( '$log', delegate);
};
decorator.$inject = ['$provide'];

export default decorator;