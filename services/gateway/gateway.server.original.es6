import http from 'http';
import httpProxy from 'http-proxy';
//
// Basic Http Proxy Server
//
const proxy = httpProxy.createProxyServer();
const urls = new Map([
	[/^\/api\/user\//, {
		target: 'http://localhost:9003',
		url: '/'
	}],
	[/^\/api\/widgets\//, {
		target: 'http://localhost:9004',
		url: '/'
	}],
]);

http.createServer((req, res) => {
	const url = req.url;
	let re, proxyTarget;

	for ([re, proxyTarget] of urls) {
		if (re.test(url)) {
			break;
		} else {
			re = undefined;
			proxyTarget = undefined;
		}
	}

	if (proxyTarget) {
		req.url = req.url.replace(re, proxyTarget.url);
		proxy.web(req, res, { target: proxyTarget.target });
	} else {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.write('wrong url ' + url);
		res.end();
	}
}).listen(8003);

//
// Target Http Server
//
http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write('request successfully proxied to service user ' + req.url);
	res.end();
}).listen(9003);

http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write('request successfully proxied to service widgets ' + req.url);
	res.end();
}).listen(9004);


console.log('http proxy server' + ' started ' + 'on port ' + '8003');