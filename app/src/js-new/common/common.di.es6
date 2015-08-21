const CTRLR = 'controller';
const CLASS = 'class';
const SINGL = 'singleton';

let Injector = {
	instances: {
		[CTRLR]: new Map(),
		[CLASS]: new Map(),
		[SINGL]: new Map()
	},
	/**
	 * creates new injector object
	 */
	create() {
		let injector = Object.create(Injector.prototype);

		// share DI instances accross different instances of Injector
		// TODO: need to think if this is wise and desired
		injector.instances = this.instances;

		return injector;
	},
	prototype: {
		_add(name, type, fn) {
			if (typeof fn !== 'function' && typeof fn !== 'object') {
				console.log(name, type, fn);
				throw new Error('not a proper injector call');
			}

			if (this._has(name, type)) {
				throw new Error('provider already existing');	
			}

			if (!this[type]) {
				throw new Error(`cannot create provider of type ${type}`)
			}

			let instance = this._resolve(fn);

			this.instances[type].set(name, instance);
		},

		_get(name) {
			let inst;

			for (let type in this.instances) {
				let m = this.instances[type];
				if (m.has(name)) {
					inst = m.get(name);
					break;
				}
			}

			return inst;
		},

		get(name) {
			if (!name || !this._has(name)) {
				throw new Error('can not get required dependency: ${name}');
			}
			
			return this._get(name);
		},

		_has(name, type = undefined) {
			let result;

			if (type) {
				result = this.instances[type].has(name);
			} else {
				for (let type in this.instances) {
					if (this.instances[type].has(name)) {
						result = true;
						break;
					}
				}
			}

			return result;
		},

		controller(name, fn) {
			this._add(name, CTRLR, fn);
		},
		singleton(name, fn) {
			this._add(name, SINGL, fn);
		},
		class(name, fn) {
			this._add(name, CLASS, fn);
		},

		_resolve(fn, thisArg = null) {
			let deps = fn.$injector;
			let args = [];
			let errors = [];

			// any dependency
			if (deps) {
				args = deps.map(dep => {
					let d = this._get(dep);

					if (!d) {
						errors.push(dep);
					}

					return d;
				});
			}

			if (errors.length) {
				throw new Error(`${fn.name}: following dependencies could not be resolved: ${errors}`);
			}

			return fn.apply(thisArg, args);
		},

		invoke(fn, thisArg = null) {
			this._resolve(fn, thisArg);
		}
	}
};


export default Injector;