import Larch from './larch.app.es6';
import init from './larch.init.es6';
import run from './larch.run.es6';
import routes from './larch.routes.es6';
import views from './larch.views.es6';
import services from './larch.services.es6';
import models from './larch.models.es6';
import components from './larch.components.es6';

// define global larch prop
window.larch = window.larch || {};

const App = Larch.create();

App.services(services);

App.models(models);

App.components(components);

App.init(init)
	.then(() => {

		App.views(views);

		App.routes(routes);

		App.run(run);
	})
	.catch(err => App.logger.error('something really bad happened', err));