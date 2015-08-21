import AppDispatcher from '../../larch.dispatcher.es6';

let ctrl = function(Dashboards, Router, Modal, Logger){
	let logger = Logger.create('ui.sidebar');

	Dashboards.on('dashboards.getAll', () => {
		this.scope.dashboards = Dashboards.list;
		this.recompile();
	});
	
	Router.on('router.navigate', (route) => {
		this.scope.route = route.props.id;
		this.recompile();
	});

	// assign event handlers
	AppDispatcher.dispatch('dashboards.getAll', 1);	

	this.scope.route = Router.current.props.id;

	this.methods = {
		new(e, ...val) {
			e.preventDefault();
			//logger.log('new method called', val);
			let m = Modal.create();

			m.open()
				.then(result => {
					logger.log(result);
				})
				.catch(err => logger.error(err));
		}
	};

};
ctrl.$injector = ['model.Dashboards', 'larch.Router', 'component.Modal','larch.Logger'];

let View = {
			id: 'ui.sidebar',
			templateUrl: './ui/sidebar.html',
			scope: {},
			methods: {},
			controller: ctrl
		};

export default View;