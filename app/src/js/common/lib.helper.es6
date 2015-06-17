'use strict';

module.exports = {
	/**
	 * [getObjProps description]
	 * @param  {[type]} source source object
	 * @param  {[type]} target target object
	 * @param  {[type]} def    object definition of the source and target attributes
	 * @return {[type]}        [description]
	 */
	getObjProps: function(source, target, def) {
		Object.keys(source).forEach(k => {
			if (def.hasOwnProperty(k)) {
				target[def[k]] = source[k];
			}
		});
	},

	handleSuccess: function() {
		return function(result) {
			return result.data;
		};
	},
	handleError: function() {
		return function(err) {
			console.log(err);
			throw new Error ('larch: general error handler');
		}
	}
};