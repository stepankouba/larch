export default {
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

	/**
	 * set service configuration based on passed argument, NODE_ENV or implicitly set to development
	 * @param {JSON} conf configuration object
	 */
	setConfiguration(conf) {
		this.env = (process.argv[2] && process.argv[2] !== '') ? process.argv[2] : process.env.NODE_ENV || 'development';

		if (!conf.environments[this.env]) {
			throw new Error('general: service can not be initiated due to missing configuration');
		}

		Object.assign(this, conf.environments[this.env]);

		this.ssl = this.protocol.startsWith('https');

		return this;
	}
};