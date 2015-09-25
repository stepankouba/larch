import { Service } from '../lib/';
import routes from './server/server.router.es6';

const conf = require('./local.json');

const service = Service.create('sources');

service.init(conf);

service.defineRoutes(routes);

service.run();

