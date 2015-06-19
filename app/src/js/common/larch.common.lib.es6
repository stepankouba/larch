'use strict';

let DateTime = {
	now: function(){
		let now = new Date();
		let [month, day, hours, minutes, seconds, millis] = 
			[now.getMonth() + 1,now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()];

		return `${day}.${month} ${hours}:${minutes}:${seconds}.${millis}`;
	}
};

let StringHelper = {
	replacer: function(str, ...vals) {
		let values = vals;

		return str;
	}
}

exports DateTime;