import Handlebars from 'handlebars';

const MAX_MIDDLE_WIDGETS = 3;

// TODO: precompilation step into gulp should be added and only runtime should be include here
// TODO: precompile all templates: http://handlebarsjs.com/precompilation.html

Handlebars.registerHelper('toggle-class', (a, b, className, options) => {
	const val = (a === b) ? className : '';

	// options.data._parent.root.test = 'testing value';

	return new Handlebars.SafeString(val);
});

Handlebars.registerHelper('lookup-property', (obj, settingName, options) => {
	console.log(obj, settingName);
	return new Handlebars.SafeString(obj[settingName]);
});

Handlebars.registerHelper('each-if', function(list, key, condition, options) {
	let result = '';
	key = key.split('.');

	if (!list) {
		return options.inverse(this);
	}
	console.log(list);
	Object.keys(list).forEach(hashKey => {
		const item = list[hashKey];
		let value;
		if (key.length > 1) {
			value = item;
			key.forEach(k => value = value[k]);
		} else {
			value = item[key[0]];
		}

		if (value === condition) {
			// add id to the item, since it doesnot have it
			item.id = hashKey;
			result = result + options.fn(item);
		}
	});

	return result === '' ? options.inverse(this) : result;
});

Handlebars.registerHelper('withHash', (list, key, options) => {
	return options.fn(list[key]);
});

Handlebars.registerHelper('middle-widgets-add-links', (list, options) => {
	let result = '';

	if (!list) {
		return false;
	}

	list = Object.keys(list).filter(key => {
		const item = list[key];

		return item.display.row === 1;
	});
	const addLinksCount = MAX_MIDDLE_WIDGETS - list.length;

	for (let i = 0; i < addLinksCount; i++) {
		const item = {index: i};
		result = result + options.fn(item);
	}

	return result;
});

export default Handlebars;