'use strict';

let array = {
	has(val) {
		return this.indexOf(val) > -1;
	}
};

let global = {
	document: {
		base() {
			let base = document.getElementsByTagName('base')[0];

			// before returning remove the ending slash, because all the routes use slash at the beginning
			return base.getAttribute('href').slice(0, -1);
		}
	},
	window: {
		location() {
			const mainFile = 'index.html';
			let url = window.location.href;
			let i;

			if ((i = url.indexOf(mainFile)) > -1) {
				return url.substr(0,i - 1); // omit the last /: i.e. http://www.example.com/
			} else {
				return url;
			}
		}
	}
};

export default {
	Global: global,
	ArrayLib: array
};