/**
 * Created by LY on 8/10/16.
 */
'use strict';
const Client = require('node-rest-client').Client;
const logger = require('./logger').logger;
const _ = require('lodash');

const client = new Client;
const defaultTimeout = 1000;

/**
 * http get request
 * @param url
 * @param data --- json
 * @param option --- {timeout: timeout} or more detail options
 * @param callback
 */
function get(url, data, option, callback) {
    if (typeof  option === 'function') {
        callback = option;
        option = {};
    }
    __request('get', url, data, option, callback);
}

/**
 * http post request
 * @param url
 * @param data --- json
 * @param option --- {timeout: timeout} or more detail options
 * @param callback
 */
function post(url, data, option, callback) {
    if (typeof  option === 'function') {
        callback = option;
        option = {};
    }
    __request('post', url, data, option, callback);
}

/**
 * retry http Request
 * @param retryParams
 * {
 *      retryTimes: number,         [optional]  default: 1, actually totalTryTimes, include first request
 *      basicRetryPeriod: number,   [optional]  default: 0 (ms)
 *      retryRatio: number          [optional]  default: 1
 * }
 * time interval between request: 0, basicRetryPeriod*retryRadio, bRP*rR*rR, bRP*rR*rR*rR
 * @param httpMethod
 * @param url
 * @param params
 * @param option
 * @param callback
 * @returns {*}
 */
function retryHttpRequest(retryParams, httpMethod, url, params, option, callback) {
    if (typeof option === 'function') {
        callback = option;
        option = {};
    }
    const retryTimes = _.isUndefined(retryParams['retryTimes']) ? 1 : retryParams['retryTimes'];
    const retryPeriod = _.isUndefined(retryParams['basicRetryPeriod']) ? 0 : retryParams['basicRetryPeriod'];
    const retryRatio = _.isUndefined(retryParams['retryRatio']) ? 1 : retryParams['retryRatio'];

    if(retryTimes === 0) {
        const msg = `Http request failed after retrying. Method: ${httpMethod} Url: ${url} Params: ${JSON.stringify(params)}`;
        return process.nextTick(function () {
            return callback(msg, null);
        });
    }
    __request(httpMethod, url, params, option, function (err, result) {
        if (err) {
            retryParams = {
                retryTimes: retryTimes - 1,
                basicRetryPeriod: retryPeriod * retryRatio,
                retryRatio: retryRatio
            };
            return setTimeout(function () {
                retryHttpRequest(retryParams, httpMethod, url, params, option, callback);
            }, retryPeriod);
        } else {
            return callback(null, result);
        }
    });
}

/**
 * real http request method
 * @param method
 * @param url
 * @param data
 * @param option
 * @param callback
 * @private
 */
function __request(method, url, data, option, callback) {
    let cbOnce = function (err, arg) {
        // node-rest-client listen one event with several listeners
        // and the condition is hard to track, so just replace callback
        // with noop to prevent double callback
        callback(err, arg);
        cbOnce = function () {};
    };
    option.checkStatus = option.checkStatus === null ? true : option.checkStatus;
    // default option
    const args = {
        headers: {'Content-Type': 'application/json'},
        requestConfig: {
            timeout: defaultTimeout,
            noDelay: true,
            keepAlive: true,
            keepAliveDelay: defaultTimeout
        },
        responseConfig: {
            timeout: defaultTimeout
        }
    };
    // brief option
    if (option.timeout) {
        args.requestConfig.timeout = option.timeout;
        args.requestConfig.keepAliveDelay = option.timeout;
        args.responseConfig.timeout = option.timeout;
    }

    // advanced config need modify below code
    if (option.requestConfig) {
        Object.assign(args.requestConfig, option.requestConfig);
    }
    if (option.responseConfig) {
        Object.assign(args.responseConfig, option.responseConfig);
    }
    if (option.headers) {
        Object.assign(args.headers, option.headers);
    }

    let clientMethod;
    // currently only support [get, post]
    if (method === 'get') {
        clientMethod = client.get;
        args.parameters = data;
    } else if (method === 'post') {
        clientMethod = client.post;
        args.data = data;
    }
    const request = clientMethod(url, args, function (data, response) {
        if (response.statusCode !== 200 && option.checkStatus) {
            return cbOnce(new Error('http status error'), null);
        }

        // if response contentType is json and node-rest-client parse json error, data will be string
        if (__isJSON(response) && typeof data === 'string') {
            cbOnce(data, null);
        } else {
            cbOnce(null, data);
        }
    });

    request.on('requestTimeout', function (req) {
        logger.error('request has expired');
        req.abort();
        return cbOnce(new Error('Request Timeout.'));
    });
    request.on('responseTimeout', function (res) {
        logger.error('response has expired');
        return cbOnce(new Error('response has expired.'));
    });
    // error造成timeout时, 会emit error和requestTimeout event
    // 所以, 在error时不进行callback
    request.on('error', function (err) {
        logger.error('error', err.request.options, err.message || err);
        return cbOnce(new Error('request error'));
    });
}

/**
 * TODO change to third party module conduct
 * whether response content-type is json
 * @param resp
 * @private
 */
function __isJSON(resp) {
    const contentType = resp['headers']['content-type'];
    return contentType.indexOf('json') !== -1;
}

module.exports = {
    post: post,     // url, data, option, callback
    get: get,       // url, data, option, callback
    retryHttpRequest: retryHttpRequest
};
