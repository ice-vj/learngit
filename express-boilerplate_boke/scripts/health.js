/**
 * 使用场景：docker容器定时做容器健康检查
 * 1. 服务容器cd流程部署时，通过此脚本做服务容器健康检查；
 * 2. npm check命令调用此脚本；
 * 3. 具体细节请参考wiki：http://wiki.iyunxiao.com/pages/viewpage.action?pageId=75792790
 * Created by wangqingang at 2017/03/05
 */

'use strict';

const config = require('config');
const errors = require('../lib/error');
const logger = require('../lib/logger').logger;
const httpClient = require('../lib/httpClient');

/**
 * 调用健康检查接口检查服务状态
 */
let serviceAddr = process.env.HOST_ADDR || '127.0.0.1';
let servicePort = process.env.SERVICE_PORT || config.get('app').port;
check(serviceAddr, servicePort);

/**
 * 检查服务状态
 * @param serviceAddr 服务地址
 * @param servicePort 服务端口
 */
function check(serviceAddr, servicePort) {
    let healthCheckUrl = `http://${serviceAddr}:${servicePort}/healthcheck`;
    httpClient.get(healthCheckUrl, {}, {}, (err, data) => {
        if (!err) process.exit(errors.SUCCESS);
        logger.fatal(JSON.stringify(err));
        process.exit(errors.INTERNAL_ERR);
    });
}