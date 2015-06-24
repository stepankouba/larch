'use strict';

import { DateTime, StringHelper } from '../common.lib.es6';

let decorator = function($provide) {
	let levels = ['log', 'debug', 'info', 'warn', 'error'];

	let delegate = function($delegate) {
		function fn(origFn){
			return function(...args) {
				let now = DateTime.dateToString();

				if (this.moduleName) {
					args.unshift(`${this.moduleName}:: `);
				}
				
				// Prepend timestamp
				args.unshift(`${now} - `);
				
				// Call the original with the output prepended with formatted timestamp
				origFn.apply(null, args);
			};

		}; 

		levels.forEach((item) => {
			$delegate[item] = fn($delegate[item]);
			// for ngMock working properly
			$delegate[item].logs = [];
		});

		$delegate.getLogger = function(moduleName) {
			const logger = Object.assign({moduleName: moduleName}, $delegate);

			return logger;
		};

		return $delegate;
	};
	delegate.$inject = ['$delegate'];
	
	
	$provide.decorator( '$log', delegate);
};
decorator.$inject = ['$provide'];

export default decorator;