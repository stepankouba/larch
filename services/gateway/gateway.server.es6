import httpProxy from 'http-proxy';
import { Service } from '../lib/';
import routes from './server/server.router.es6';

const conf = require('./local.json');
const proxy = httpProxy.createProxyServer();
const service = Service.create('gateway');
const routePrefix = /^\/api\//;

const proxyMidwr = function(req, res, next) {
	let r;

	for (r of routes) {
		if (r.re.test(req.url)) {
			break;
		} else {
			r = undefined;
		}
	}

	if (r) {
		req.url = req.url.replace(routePrefix, '/');

		proxy.on('error', Service.prototype._errorHandler('proxy error'));

		console.log(r.target);

		proxy.web(req, res, { target: r.target });
	}
};

service.init(conf, {bodyParser: false});

for (const r of routes) {

	r.routes.forEach(rr => rr.middleware.unshift(proxyMidwr));

	service.defineRoutes(r.routes);
}

// service.server.use(proxyMidwr);

service.run();