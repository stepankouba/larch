'use strict';

let DateTime = {

	/**
	 * converts date to a formated string: DD.MM - HH:MM:SS.MS
	 * 
	 * @param  {string=} date optinal value to be passed as a string 
	 * @return {string}	formated string 
	 */
	dateToString: function(date = undefined){
		let d = date ? new Date(date) : new Date();
		let dArray = 
			[d.getMonth() + 1,d.getDate(), d.getHours(), d.getMinutes(),  d.getSeconds(), d.getMilliseconds()];

		dArray = dArray.map((i) => i.toString().length === 1 ? '0' + i : i );

		return `${dArray[1]}.${dArray[0]} - ${dArray[2]}:${dArray[3]}:${dArray[4]}.${dArray[5]}`;
	}
};


let AJAXHelper = {
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


let ObjectHelper = {
	/**
	 * copy properties from source to target but only as they are defined in def object with following syntax:
	 * ```{
	 * 	sourceProp: 'targetProp',
	 * 	...
	 * }```
	 * 
	 * 
	 * @param  {object} source 	source object
	 * @param  {object} target 	target object
	 * @param  {object} def    	object definition of the source and target attributes
	 * @return {object} 		returning target object
	 */
	copyDefinedProps: function(source, target, def) {
		Object.keys(source).forEach(k => {
			if (def.hasOwnProperty(k)) {
				target[def[k]] = source[k];
			}
		});

		return target;
	}
};

export { DateTime, AJAXHelper, ObjectHelper };
