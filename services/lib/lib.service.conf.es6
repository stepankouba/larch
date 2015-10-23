const Config = {
	/**
	 * set service configuration based on passed argument, NODE_ENV or implicitly set to development
	 * @param {JSON} conf configuration object
	 */
	setConfiguration(conf) {
		const env = (process.argv[2] && process.argv[2] !== '') ? process.argv[2] : process.env.NODE_ENV || 'development';

		if (!conf.environments[env]) {
			throw new Error('general: service can not be initiated due to missing configuration');
		}

		const c = Object.assign(Object.create(Config.prototype), conf.environments[env]);
		c.env = env;
		c.ssl = c.protocol.startsWith('https');

		return c;
	},
	prototype: {
		/**
		 * environment specification
		 */
		env: undefined,

		/**
		 * service port
		 * @type {number}
		 */
		port: undefined,

		/**
		 * db settings
		 * @type {Object}
		 */
		db: {},

		/**
		 * definition of SSL usage for a service
		 * @type {Boolean}
		 */
		ssl: undefined,
	}
};

export default Config;