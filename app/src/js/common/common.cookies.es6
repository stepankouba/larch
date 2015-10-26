import Cookies from '../lib/lib.cookies.es6';

const CookiesMdlFn = function() {
	// create model object
	const CookiesMdl = {
		get(name) {
			return Cookies.getItem(`larch.${name}`);
		},
		set(name, value, {end} = {}) {
			Cookies.setItem(`larch.${name}`, value, end);
		},
		remove(name) {
			Cookies.removeItem(`larch.${name}`);
		}
	};

	return CookiesMdl;
};
CookiesMdlFn.$injector = [];

export default CookiesMdlFn;