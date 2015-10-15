export default {
	/**
	 * get values from form based on data-model attribute
	 * @param  {String} formId form id
	 * @return {Object}        created hashmap based on the form
	 */
	getValues(formId) {
		const fields = document.querySelectorAll(`#${formId} [data-model]`);
		const result = {};

		[].forEach.call(fields, field => {
			const key = field.getAttribute('data-model');
			/*eslint no-eval:0*/
			const value = (field.tagName === 'SELECT') ? eval(field.value) : field.value.trim();
			result[key] = value;
		});

		return result;
	},
	/**
	 * check values in form before they are passed to the processing
	 * if the item does not pass, has-error is added to the field
	 * 
	 * @param  {String} formId form id
	 * @return {Boolean} if everything OK, true, else false
	 */
	testValues(formId) {
		const fields = document.querySelectorAll(`#${formId} [data-model]`);
		let result = true;

		[].forEach.call(fields, field => {
			const value = field.value.trim();
			if (!value) {
				field.parentNode.classList.toggle('has-error');
				result = false;
			} else {
				field.parentNode.classList.remove('has-error');
			}
		});

		return result;
	}
};