/**
 * Created by kevin on 20171011
 */
'use strict';
const express = require('express');
const router = express.Router();

const Thenjs = require('thenjs');
const _ = require('lodash');

const config = require('config');

const utils = require('../lib/utils');
const cookieUtils = require('../lib/cookie');
const apis = require('../lib/api');
const enums = require('../lib/enum');
const errCodes = require('../lib/error');

/**
 * 
 */
router.get('', function (req, res) {
    let errMsg = utils.buildErrMsg(req, apis.);

    if (_.isNil()) {
        errMsg.msg = 'Param field missed.';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '参数错误', null, errMsg));
    }

    Thenjs(function (cont) {
        
    }).then(function (cont, arg) {
        
    }).fin(function (cont, err, arg) {
        if (err) {
            errMsg.msg = ' err';
            errMsg.logLevel = 'error';
            errMsg.errStack = err.stack || err;
            return res.json(utils.resJSON(errCodes., '错误', null, errMsg));
        }

        errMsg.msg = 'success';
        return res.json(utils.resJSON(errCodes.SUCCESS, '成功', result, errMsg));
    });
});