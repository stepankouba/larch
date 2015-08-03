'use strict';

let express = require('express');
let	server = express();
let bodyParser = require('body-parser');
let master = require('../master.services.json');
let router = require('./server/server.router.es6');
let morgan = require('morgan');

// support json encoded params
server.use( bodyParser.json() );

server.use(morgan('dev'));

// create routes
router.createRoutes(server);

// based on master definition
server.listen(master.services.log.port);

console.log('log.server.es6: server started');