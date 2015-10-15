// taken from https://developer.mozilla.org
export default {
	/**
	 * get cookie item by name
	 * @param  {String} sKey [description]
	 * @return {String|undefined} cookie value
	 */
	getItem(sKey) {
		if (!sKey) {
			return null;
		}

		return decodeURIComponent(
			document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=\\s*([^;]*).*$)|^.*$`), '$1')
			) || undefined;
	},
	/**
	 * Create/overwrite a cookie
	 * @param {String} sKey    The name of the cookie to create/overwrite
	 * @param {String} sValue  The value of the cookie
	 * @param {String} vEnd    The max-age in seconds (e.g. 31536e3 for a year, Infinity for a never-expires cookie), or the expires date in GMTString format or as Date object; if not specified the cookie will expire at the end of session (number – finite or Infinity – string, Date object or null).
	 * @param {String} sPath   E.g., "/", "/mydir"; if not specified, defaults to the current path of the current document location (string or null). The path must be absolute (see RFC 2965).
	 * @param {String} sDomain E.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com"; if not specified, defaults to the host portion of the current document location (string or null).
	 * @param {Boolean} bSecure [description]
	 */
	setItem(sKey, sValue, vEnd = undefined, sPath = undefined, sDomain = undefined, bSecure = undefined) {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}

		let sExpires = '';
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
					break;
				case String:
					sExpires = `; expires=${vEnd}`;
					break;
				case Date:
					sExpires = `; expires=${vEnd.toUTCString()}`;
					break;
			}
		}

		sDomain = sDomain ? `; domain=${sDomain}` : '';
		sPath = sPath ? `; path=${sPath}` : '';
		bSecure = bSecure ? `; secure` : '';

		console.log(`${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${sDomain}${sPath}${bSecure}`);
		document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(sValue)}${sExpires}${sDomain}${sPath}${bSecure}`;

		return true;
	},
	/**
	 * Delete a cookie.
	 * @param  {String}  sKey    The name of the cookie to remove
	 * @param {String|Boolean} sPath   E.g., "/", "/mydir"; if not specified, defaults to the current path of the current document location (string or null). The path must be absolute (see RFC 2965).
	 * @param {String|Boolean} sDomain E.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com"; if not specified, defaults to the host portion of the current document location (string or null).
	 * @return {Boolean}
	 */
	removeItem(sKey, sPath = undefined, sDomain = undefined) {
		if (!this.hasItem(sKey)) {
			return false;
		}

		sDomain = sDomain ? `; domain=${sDomain}` : '';
		sPath = sPath ? `; path=${sPath}` : '';

		document.cookie = `${encodeURIComponent(sKey)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${sDomain}${sPath}`;

		return true;
	},
	/**
	 * Check whether a cookie exists in the current position.
	 * @param  {String}  sKey The name of the cookie to test (string).
	 * @return {Boolean}
	 */
	hasItem(sKey) {
		if (!sKey) {
			return false;
		}

		return (new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&')}\\s*\\=`)).test(document.cookie);
	},
	/**
	 * Returns an array of all readable cookies from this location.
	 * @return {Array} list of available cookies
	 */
	keys() {
		const aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);

		return aKeys.map(item => decodeURIComponent(item));
	}
};