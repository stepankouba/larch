export default {
	/**
	 * get value of param in the url
	 * @param  {String} name 		name of the param
	 * @return {String|undefined} 	value, if not found undefined
	 */
	search(name) {
		name = name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
		const regexS = `[\\?&]${name}=([^&#]*)`;
		const regex = new RegExp(regexS);
		const results = regex.exec(window.location.href);

		if (results === null) {
			return undefined;
		} else {
			return results[1];
		}
	}
};