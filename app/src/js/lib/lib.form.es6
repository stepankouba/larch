export default {
	getValues() {
		const fields = document.querySelectorAll('[data-model]');
		const result = {};

		[].forEach.call(fields, field => {
			const key = field.getAttribute('data-model');
			/*eslint no-eval:0*/
			const value = (field.tagName === 'SELECT') ? eval(field.value) : field.value.trim();
			result[key] = value;
		});

		return result;
	}
};