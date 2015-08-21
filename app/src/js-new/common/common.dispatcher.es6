const PREFIX = 'dispatcher-id';

let Dispatcher = {
	create() {
		let disp = Object.create(Dispatcher.prototype);
		
		return disp;
	},
	prototype: {
		/**
		 * chamber.action.model.id = functor;
		 * @type {Object}
		 */
		chamber: {},
		_callbacks: {},
		_isPending: {},
		_hasBeenStarted: {},
		_lastNumId: 0,
		_isDispatching: false,
		_currentData: undefined,
		_currentAction: undefined,

		_createId() {
			this._lastNumId++;
			return `${PREFIX}-${this._lastNumId}`;
		},

		register(model, actionName, fn){
			let id = this._createId();

			if (!this.chamber[actionName]) {
				this.chamber[actionName] = {};
			}

			this.chamber[actionName][model] = id;
			this._callbacks[id] = fn;

			return id;
		},

		dispatch(action, data) {
			let models = this.chamber[action];

			if (this._isDispatching) {
				throw new Error('Error: can not dispatch, while already dispatching');
			}

			this._startDispatch(action, data);

			try {
				// for ... of is not working (don't know why - throwing _iteratorError, there for using hack)
				for (let m in models) {
					let id = models[m];

					if (!this._hasBeenStarted[id]) {
						this._invokeFn(id);
					}
				}
			} finally {
				this._stopDispatch();
			}
		},

		/**
		 * which models run before the current callback is started;
		 * This method is called within the callback for a particular model
		 * 
		 * @param  {Array} models array of model names, which have to be started before a callback proceeds
		 * @return {[type]}        [description]
		 */
		waitFor(models){
			let currentAction = this.chamber[this._currentAction];

			models.forEach(model => {
				let id = currentAction[model];

				// check circular wait for and if it was already handled
				if (!this._isPending[id] && !this._hasBeenStarted[id]) {
					this._invokeFn(id);
				}
			});
		},

		_invokeFn(id) {
			this._isPending[id] = true;
			this._callbacks[id](this._currentData);
			this._hasBeenStarted[id] = true; 
		},

		_startDispatch(action, data) {
			for (let id in this._isPending) {
				this._isPending[id] = false;
				this._hasBeenStarted[id] = false;
			}

			this._isDispatching = true;
			this._currentData = data;
			this._currentAction = action;
		},

		_stopDispatch() {
			this._isDispatching = false;
			delete this._currentData;
			delete this._currentAction;
		}
	}
};

export default Dispatcher;