'use strict';
const express = require('express');
const router = express.Router();

const apis = require('../lib/api');
const errCodes = require('../lib/error');
const utils = require('../lib/utils');
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const dbDriver = require('../lib/dbDriver').get();
const { ObjectId } = require('mongodb'); // or ObjectID 
const peterMgr = require('peter').getManager('usertest');

router.post('/addarticle', function (req, res) {

    let errMsg = utils.buildErrMsg(req, apis.ADDACT);
    let c_id = req.cookies.u_id;
    let article = {
        u_id: req.cookies.u_id,
        title: req.body.title,
        content: req.body.content,
        c_id: c_id + 'cid',
        classify: req.body.classify,
        date: new Date(),
        talks: [],
        //[{content:'123'}]
    }

    // console.log(article.title + "/n");
    // console.log(article.date + "/n")
    // console.log(article.u_id);
    if (_.isNil(article.u_id) || _.isNil(article.title)) {

        errMsg.msg = '没有登陆或文章为空';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '发表失败', null, errMsg));
    }
    peterMgr.create('@Boke', { article }, function (err, data) {
        if (err) {
            errMsg.msg = '添加失败';
            return res.json(utils.resJSON(errCodes.ADDARC_ERR, '添加失败', null, errMsg));
        }
        errMsg.msg = 'success';
        return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', null, errMsg));
    });

});


module.exports = router;