'use strict';

let express = require('express');
let	server = module.exports = express();
let bodyParser = require('body-parser');
let master = require('../master.services.json');
let router = require('./server/server.router.es6');
let morgan = require('morgan');

// support json encoded params
server.use( bodyParser.json() );
server.use( bodyParser.urlencoded({extended: true}) );

server.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3333');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

server.use(morgan('dev'));

// create routes
router.createRoutes(server);

// based on master definition
server.listen(master.services.user.port);

console.log('user.server.es6: server started...');