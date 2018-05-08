/**
 * Created by LJ on 12/30/15.
 */
/**
 * For OPs to check the service is ok!
 */
'use strict';
const express = require('express');
const router = express.Router();

const apis = require('../lib/api');
const errCodes = require('../lib/error');
const utils = require('../lib/utils');

/**
 * health check
 */
router.get('/test', function (req, res) {
    let errMsg = utils.buildErrMsg(req, apis.HEALTH_CHECK);

    errMsg.msg = 'success';
    return res.json(utils.resJSON(errCodes.SUCCESS, 'Health OK test', 'Health OK', errMsg));
});

module.exports = router;