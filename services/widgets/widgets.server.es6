import { Service } from '../lib/';
import routes from './server/server.router.es6';

const conf = require('./local.json');

const service = Service.create('widgets');

service.init(conf);

service.defineRoutes(routes);

service.run();

