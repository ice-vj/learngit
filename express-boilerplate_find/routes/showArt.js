'use strict';
const express = require('express');
const router = express.Router();

const apis = require('../lib/api');
const errCodes = require('../lib/error');
const utils = require('../lib/utils');
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const dbDriver = require('../lib/dbDriver').get();
const { ObjectId } = require('mongodb');

//显示文章标题和类别
router.get('', function (req, res) {

    let errMsg = utils.buildErrMsg(req, apis.SHOWTITLE);
    let show_ct = { 'article.title': 1, 'article.classify': 1 }
    dbDriver.collection('article_tb').find().sort({ 'article.date': -1 }).project(show_ct).toArray(function (err, data) {
        console.log("data: " + data.length);
        if (err) {
            errMsg.msg = '数据库错误';
            return res.json(utils.resJSON(errCodes.DB_ERR, '数据库错误', null, errMsg));
        }
        if (data.length !== 0) {
            let titles = [];
            let classifys = [];
            //遍历并将文章标题放入数组
            for (let i = 0; i < data.length; i++) {
                titles[i] = data[i].article.title;
                // console.log(data[i].article.title);
                classifys[i] = data[i].article.classify;
            }
            let results = 'title:' + titles + 'classifys:' + classifys;
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', results, errMsg));
        }
        errMsg.msg = '没有文章';
        return res.json(utils.resJSON(errCodes.SHOWTITLE_ERR, '没有文章', null, errMsg));
    });
});


//根据文章分类查找文章
router.get('/showartByclassify/:c_id', function (req, res) {

    let errMsg = utils.buildErrMsg(req, apis.SHOWCLASSIFY);
    let c_id = req.params.c_id;
    console.log(c_id);
    if (_.isNil(c_id)) {
        errMsg.msg = '没找到类别';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '没找到类别', null, errMsg));
    }
    dbDriver.collection('article_tb').findOne({ 'article.c_id': c_id }, function (err, data) {
        if (err) {
            errMsg.msg = '数据库错误';
            return res.json(utils.resJSON(errCodes.SHOWCLASS_ERR, '数据库错误', null, errMsg));
        } else if (!_.isNil(data)) {
            let talks =  data.article.talks;
            let newtalks = [];
            for(let i = 0; i < talks.length; i++){
                if(talks[i].flag !== 0)
                newtalks[i] = talks[i];
            }
                delete data.article.talks;
                console.log(newtalks);
                errMsg.msg = 'success';
                return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', [data,newtalks], errMsg));
            
        } else {
            errMsg.msg = '没有分类';
            return res.json(utils.resJSON(errCodes.SHOWCLASS_ERR, '没有分类', null, errMsg));
        }
    });
});



module.exports = router;