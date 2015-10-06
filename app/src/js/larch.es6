import Larch from './larch.app.es6';
import init from './larch.init.es6';
import routes from './larch.routes.es6';
import views from './larch.views.es6';
import services from './larch.services.es6';
import models from './larch.models.es6';
import components from './larch.components.es6';

const App = Larch.create();

App.services(services);

App.models(models);

App.components(components);

App.views(views);

App.routes(routes);

App.init(init);