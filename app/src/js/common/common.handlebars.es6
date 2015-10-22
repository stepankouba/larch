import Handlebars from 'handlebars';

const MAX_MIDDLE_WIDGETS = 3;

// TODO: precompilation step into gulp should be added and only runtime should be include here
// TODO: precompile all templates: http://handlebarsjs.com/precompilation.html

Handlebars.registerHelper('toggle-class', (a, b, className, elseClassName = '', options) => {
	const val = (a === b) ? className : elseClassName;

	// options.data._parent.root.test = 'testing value';

	return new Handlebars.SafeString(val);
});

Handlebars.registerHelper('lookup-property', (obj, settingName, options) => {
	return new Handlebars.SafeString(obj[settingName] || '');
});

Handlebars.registerHelper('max-char', (text, max, options) => {
	const len = text.length;
	text = len > max ? `${text.substr(0, max)}...` : text;
	return new Handlebars.SafeString(text);
});

Handlebars.registerHelper('get-position', (num, options) => {
	const POSITIONS = ['TOP', 'MIDDLE', 'BOTTOM'];

	return new Handlebars.SafeString(POSITIONS[num]);
});

Handlebars.registerHelper('if-eq', function(v1, v2, options) {
	if (v1 === v2) {
		return options.fn(this);
	}
});

Handlebars.registerHelper('row-class', (layout, rowType, row, options) => {
	if (!layout) {
		return new Handlebars.SafeString(`row-0`);
	}
	// rowType == 'tall' || 'short'
	let className;
	const countTall = layout.filter(i => i === 'tall').length;
	const countShort = layout.filter(i => i === 'short').length;

	if (layout[row] === 'short') {
		className = '20';
	} else if (layout[row] === 'tall') {
		className = countShort > 0 ? (80 / countTall) : (100 / countTall);
	} else {
		className = '0';
	}

	return new Handlebars.SafeString(`row-${className}`);
});

Handlebars.registerHelper('each-if', function(list, key, condition, options) {
	let result = '';
	key = key.split('.');

	if (!list) {
		return options.inverse(this);
	}

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

Handlebars.registerHelper('random-text', options => {
	const lines = options.fn(this).trim().split('\n');
	const random = Math.floor(Math.random() * lines.length);

	return new Handlebars.SafeString(lines[random]);
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