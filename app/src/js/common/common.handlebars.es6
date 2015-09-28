import Handlebars from 'handlebars';

// TODO: precompilation step into gulp should be added and only runtime should be include here
// TODO: precompile all templates: http://handlebarsjs.com/precompilation.html

Handlebars.registerHelper('toggle-class', (a, b, className, options) => {
	const val = (a === b) ? className : '';

	// options.data._parent.root.test = 'testing value';

	return new Handlebars.SafeString(val);
});

Handlebars.registerHelper('each-if', (list, key, condition, options) => {
	let result = '';
	key = key.split('.');

	if (!list) {
		return false;
	}

	list.forEach(item => {
		let value;
		if (key.length > 1) {
			value = item;
			key.forEach(k => value = value[k]);
		} else {
			value = item[key[0]];
		}

		if (value === condition) {
			result = result + options.fn(item);
		}
	});

	return result;
});

Handlebars.registerHelper('hash-table', (list, key, options) => {
	return options.fn(list[key]);
});

export default Handlebars;