'use strict';

import { DateTime, StringHelper } from '../common.lib.es6';

let decorator = function($provide) {

	let delegate = function($delegate) {

		['log', 'debug', 'info', 'warn', 'error'].forEach((item) => {
			let fn = function(origFn){
				return function(...args) {
					let now = DateTime.dateToString();
					
					// Prepend timestamp
					args.unshift(`${now} - `);
					
					// Call the original with the output prepended with formatted timestamp
					origFn.apply(null, args);
				};

			}; 

			$delegate[item] = fn($delegate[item]);
			// for ngMock working properly
			$delegate[item].logs = [];
		});

		return $delegate;
	};
	delegate.$inject = ['$delegate'];
	
	
	$provide.decorator( '$log', delegate);
};
decorator.$inject = ['$provide'];

export default decorator;