const WIDGET_WIDTH = 3;

let LarchBoardSrvc = function(DashSrvc) {
	return {
		id: null,
		dashboards: null,
		dashboard: null,

		/**
		 * gets and stores list of all the dashboards from db
		 * @param  {number} userId user ID
		 * @return {Promise}       
		 */
		getAll: function(userId) {
			return DashSrvc.getAll(userId || 1)
				.then(data => {
					this.dashboards = data;
				});
		},
		/**
		 * gets specif
		 * @param  {String} id [description]
		 * @return {[type]}    [description]
		 */
		getById: function(id = 'home') {
			let promise;

			promise = DashSrvc.getById(id);	
			
			return promise
				.then((data) => {
					this.dashboard = data;
				});
		},
		getCurrentWidgets: function() {
			return this.dashboard.widgets.map(item => {
				item.width = item.w * WIDGET_WIDTH;
				item.height = item.h;

				return item; 
			});
		},
		getCurrentRows: function() {
			let result = {};

			// count rows in 
			this.dashboard.widgets.forEach(item => {
				let row = item.y.toString();

				if (row in result) {
					result[row]++;
				} else {
					result[row] = 1;
				}
			});

			return result;
		}
	};
};
LarchBoardSrvc.$inject = ['DashSrvc'];

export default LarchBoardSrvc;