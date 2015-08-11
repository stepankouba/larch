'use strict';

import Larch from './larch.app.es6';

let App = Larch.createApp();

// App.initViews();

let init = function(Logger, HTTPer) {
	let logger = Logger.create('app.init');
};
init.$injector = ['larch.Logger', 'larch.HTTPer'];

App.init(init);

App.routes([{
		templateUrl: './dash/dashboard.html',
		url: '/dashboard/{{id}}',
		main: true,
		controller: function() { console.log('testing here') }
	}
]);
