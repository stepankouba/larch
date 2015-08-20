import Handlebars from 'handlebars';

// TODO - precompilation step into gulp should be added and only runtime should be include here
// TODO - precompile all templates: http://handlebarsjs.com/precompilation.html

Handlebars.registerHelper('toggle-class', function (a, b, className, options) {
	let val = a == b ? className : '';

	options.data._parent.root.test = 'testing value';

	return new Handlebars.SafeString(val);
});

// Handlebars.registerHelper('use-events', function (...array) {
// 	console.log(array);

// 	return new Handlebars.SafeString('');
// });

export default Handlebars;