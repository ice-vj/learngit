/**
 * Created by LJ on 5/26/15.
 * 生成router相关信息
 */
'use strict';
const _ = require('lodash');
const utils = require('./utils');

const healthCheck = require('../routes/health');
const user = require('../routes/user');
const article = require('../routes/article');
const showArt = require('../routes/showArt');
// const ptarticle = require('../routes/ptarticle');
const paper = require('../routes/exampaper');


const routers = {
    // For OP health Check
    '/healthcheck': healthCheck,

    //登陆和注册
    '/user': user,

    //博客文章操作
    '/article': article,
    '/showArt': showArt,
 

    //试卷查找
    '/paper': paper,

    // //用peter进行操作
    // '/ptarticle':ptarticle,
};

function initRoute(app) {
    // 处理所有URL
    _.each(routers, function (action, path) {
        app.use(path, action);
    });

    // catch 404 and forward to
    // error handler
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // catch 500 internal error handler
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);

        const errMsg = {
            ip: req.ip,
            msg: 'IN uri error: ' + req.originalUrl,
            logLevel: 'error'
        };

        if (err.status == 404) {
            errMsg.msgIn = 'Not Found';
            return res.json(utils.resJSON(404, 'Not Found', null, errMsg));
        }
        errMsg.msgIn = 'Capture Internal err!';
        errMsg.errStack = err.stack || err;
        return res.json(utils.resJSON(1000, '内部错误', null, errMsg));
    });
}

module.exports = {
    initRoute: initRoute
};
