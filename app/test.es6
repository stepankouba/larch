'use strict';

let ar = [
	{type: 'obj1'},
	{type: 'obj2'}
];

function* data() {
	for (let a of ar) {
		//yield new Promise(a);
	}
}

for (let x of data()) {
	console.log(x);
}