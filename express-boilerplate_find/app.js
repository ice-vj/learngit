'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const logger = require('./lib/logger').logger;
const routers = require('./lib/router');
const utils = require('./lib/utils');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.raw({ limit: '10mb' }));
app.use(cookieParser());

const localAddress = utils.getServerLocalAddressAndPort();

// middleware to inject client info into req object
app.all('*', function (req, res, next) {
    // inject ip behind Nginx
    // Note: we cannot overwrite req.ip: http://stackoverflow.com/a/33113848/1548043
    req.realIP = req.header('X-Real-IP') || req.ip;
    // inject localAddress : eth0.address(ipv4) + bindPort
    // https://nodejs.org/api/os.html#os_os_networkinterfaces
    req['localAddress'] = localAddress;
    next();
});

if (process.env.FULL_LOG == 'on') {
    app.all('*', function (req, res, next) {
        // Log down
        req.reqSeq = Math.random() * 1000 | 0;  // to identify log line
        logger.info(`[${req.reqSeq}]${req.method} ${req.url} from ${req.realIP} with query ${JSON.stringify(req.query)} and body ${JSON.stringify(req.body)}`);

        next();
    });
}

// Init Routers
routers.initRoute(app);

module.exports = app;