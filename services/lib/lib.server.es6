/**
 * @fileOverview 
 * @author 
 * @license [url] [description]
 */

export default {
	/**
	 * [createRoutes description]
	 * @param  {[type]} app    [description]
	 * @param  {[type]} routes [description]
	 * @return {[type]}        [description]
	 */
	createRoutes: function cr(app, routes) {
		routes.forEach(route => {
			let method = route.httpMethod.toLowerCase();
			// flatten array
			let args = [].concat.apply([], [route.path, route.middleware]);


			if (app[method]) {
				app[method].apply(app, args);
			} else {
				console.error('lib.server: this.createRoutes has no method in app');
			}
		});
	},

	/**
	 * simple parameter handler
	 * @param  {[type]} code [description]
	 * @param  {[type]} res  [description]
	 * @param  {String} text [description]
	 * @return {[type]}      [description]
	 */
	paramErrorHandler: function(code, res, text = 'error without text') {
		res.sendStatus(code);
		throw new Error(text);
	},

	/**
	 * returning rethinkdb error handler function
	 * @param  {number} 	code	HTTP Code
	 * @param  {[type]} 	res  	response object created by expressjs
	 * @return {Function}   simple error handler function
	 */
	rethinkErrorHandler: function(code, res) {
		return function(err) {
			res.statusCode(code);
			console.log(err);
			throw new Error('rethinkdb error');
		};
	}
};