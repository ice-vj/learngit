'use strict';
const Thenjs = require('thenjs');
const peterMgr = require('peter').createManager('express-boilerplate');
const config = require('config');

const logger = require('../../lib/logger').logger;
const utils = require('../../lib/utils');

const MongoClient = require('mongodb').MongoClient;
const dbDriver = require('../../lib/dbDriver');


let isInit = false; // 服务是否初始化
let appx;           // 服务对象

function getApp(callback) {
    if(isInit) return setImmediate(callback, null, appx);
    Thenjs(function (cont) {
        // TODO: 使用mongodb请在此初始化
        // peterMgr.bindDb(config.get('mongo').uri, cont);
        MongoClient.connect(config.get('mongo').uri, cont);
        // cont();
    }).then(function (cont, arg) {
        dbDriver.init(arg);
        logger.info('Peter is ready now!');
        let app = require('../../app');
        cont(null, app);
    }).fin(function (cont, err, app) {
        isInit = true;
        appx = app;
        return callback(err, app);
    });
}

module.exports = {
    getApp: getApp,
};