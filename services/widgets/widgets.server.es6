import { Service } from '../lib/';
import routes from './server/server.router.es6';

const service = Service.create('widgets');

service.init();

service.defineRoutes(routes);

service.run();