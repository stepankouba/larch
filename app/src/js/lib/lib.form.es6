import Msg from '../larch.messages.es6';

const Form = {
	validate(value, name) {
		const Validators = {
			'public-url': /^https:\/\/anylarch.com\/public\/(.*)$/,
			'dashboard-description': /.*/
		};

		if (Validators[name]) {
			return Validators[name].test(value);
		} else {
			return undefined;
		}
	},
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
		const result = [];

		[].forEach.call(fields, field => {
			const value = field.value.trim();
			const validator = field.getAttribute('data-validate');
			const err = field.getAttribute('data-error');

			// if validator check it
			if (validator) {
				if (!Form.validate(value, validator)) {
					field.parentNode.classList.add('has-error');
					result.push(err);
				} else {
					field.parentNode.classList.remove('has-error');
				}
			} else {
				if (!value) {
					field.parentNode.classList.add('has-error');
					result.push(err);
				} else {
					field.parentNode.classList.remove('has-error');
				}
			}

			// if not, empty
		});

		return result.length ? result : undefined;
	},
	/**
	 * display results in the form
	 * @param  {String} selector selector for alert div in the form
	 * @param  {Object|undefined} errors   array of resutls messages
	 */
	displayResults(selector, { errors = undefined, success = undefined }) {
		const el = document.querySelector(selector);

		if (errors) {
			errors = Array.isArray(errors) ? errors.map(e => Msg.get(e)) : Msg.get(errors);

			el.classList.remove('alert-success');
			el.classList.add('alert-danger');
			el.innerHTML = Array.isArray(errors) ? errors.join('\n<br>\n') : errors;
			el.classList.remove('hidden');
		}

		if (success) {
			success = Array.isArray(success) ? success.map(e => Msg.get(e)) : Msg.get(success);

			el.classList.remove('alert-danger');
			el.classList.add('alert-success');
			el.innerHTML = Array.isArray(success) ? success.join('\n<br>\n') : success;
			el.classList.remove('hidden');
		}
	}
};

export default Form;