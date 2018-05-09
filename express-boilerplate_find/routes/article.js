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

//添加文章
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
    dbDriver.collection('article_tb').insertOne({article}, function (err, data) {
        if (err) {
            errMsg.msg = '数据库错误';
            return res.json(utils.resJSON(errCodes.DB_ERR, '数据库错误', null, errMsg));
        }
        if (_.isNil(data)) {
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', null, errMsg));
        } else {
            errMsg.msg = '添加失败';
            return res.json(utils.resJSON(errCodes.ADDARC_ERR, '添加失败', null, errMsg));
        }
    });

});

//添加评论
router.post('/addTalk', function (req, res) {

    let errMsg = utils.buildErrMsg(req, apis.ADDTALK);
    let art_id = req.body.art_id;
    var talks = {
        _id: new Date().getTime() + 'tid',
        u_id: req.cookies.u_id,
        art_id: req.body.art_id,
        talk: req.body.talk,
        flag: 1,
    }
    console.log(talks.u_id + talks.talk + art_id);

    if (_.isNil(talks.u_id) || _.isNil(talks.talk)) {

        errMsg.msg = '没有登陆或回复为空';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '回复失败', null, errMsg));
    }
    let condition = { '_id': ObjectId(art_id) };
    dbDriver.collection('article_tb').update(condition, { $push: { 'article.talks': talks } }, function (err, data) {
        if (err) {
            errMsg.msg = '添加失败';

            return res.json(utils.resJSON(errCodes.TALK_ERR, '添加失败', null, errMsg));
        }
        if (!_.isNil(data)) {
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', { data }, errMsg));
        } else {
            errMsg.msg = '没有查到该文章';
            return res.json(utils.resJSON(errCodes.TALK_ERR, '添加err', null, errMsg));
        }
    });

});
//删除评论(未修改)
router.delete('/deleteTalk/:_id', function (req, res) {

    let errMsg = utils.buildErrMsg(req, apis.DELETETALK);

    let user_id = req.cookies.u_id;
    let talk_id = req.params._id;


    console.log("u_id: " + user_id);
    console.log("talk_id: " + talk_id);
    if (_.isNil(user_id)) {
        errMsg.msg = '没有登陆';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '没有登陆', null, errMsg));
    }
    //查询是否该用户发的该评论
    let query = { 'article.talks.u_id': user_id, 'article.talks._id': talk_id };
    dbDriver.collection('article_tb').findOne(query, function (err, data) {
        console.log("data: " + data.article.talks);
        if (err) {
            errMsg.msg = '数据错误';
            return res.json(utils.resJSON(errCodes.DB_ERR, '数据错误', null, errMsg));
        }
        if (!_.isNil(data)) { //查到本人的评论
            //更改参数（软删除）
            let updatecondition = { 'article.talks._id': talk_id };
            let setcondition = { 'article.talks.flag': 0 };
            dbDriver.collection('article_tb').update(updatecondition, { $push: setcondition }, function (err, doc) {
                if (err) {
                    errMsg.msg = '删除失败';
                    return res.json(utils.resJSON(errCodes.DB_ERR, '删除失败', null, errMsg));
                } else {
                    errMsg.msg = 'success';
                    return res.json(utils.resJSON(errCodes.SUCCESS, '删除成功', null, errMsg));
                }
            });
        } else {
            errMsg.msg = '不能删除别人发帖';
            return res.json(utils.resJSON(errCodes.TALK_ERR, '删除失败', null, errMsg));
        }
    });

});

module.exports = router;