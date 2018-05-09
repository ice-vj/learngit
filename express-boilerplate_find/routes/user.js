'use strict';
const express = require('express');
const router = express.Router();

const apis = require('../lib/api');
const errCodes = require('../lib/error');
const utils = require('../lib/utils');
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
var dbDriver = require('../lib/dbDriver').get();


//登陆
router.post('/login', function (req, res) {
    let errMsg = utils.buildErrMsg(req, apis.USER_LOGIN);
    let username = req.body.username;
    let password = req.body.password;
    if (_.isNil(username) || _.isNil(password)) {
        //用户名或密码为空
        errMsg.msg = '用户名或密码为空';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '用户名或密码为空', null, errMsg));
    }
    let query = { 'username': username, 'password': password };
    dbDriver.collection('usertb').findOne(query, function (err, data) {
        console.log(data);
        if (err) {
            errMsg.msg = 'login err';
            return res.json(utils.resJSON(errCodes.DB_ERR, '数据错误', null, errMsg));
        } else if (_.isNil(data)) {
            errMsg.msg = '登陆失败';
            return res.json(utils.resJSON(errCodes.LOGIN_ERR, '登陆失败', null, errMsg));
        } else {
            res.cookie('u_id', data._id, { expires: new Date(Date.now() + 900000), httpOnly: true });
            errMsg.msg = 'success';
            //console.log(data.username + data.password + "==");
            return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', data, errMsg));
        }
    });
});


//注册
router.post('/regist', function (req, res) {
    let errMsg = utils.buildErrMsg(req, apis.USER_REGIST);

    let username = req.body.username;
    let password = req.body.password;

    if (_.isNil(username) || _.isNil(password)) {
        //用户名或密码为空
        errMsg.msg = '用户名或密码为空';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, '用户名或密码为空', null, errMsg));
    }
    dbDriver.collection('usertb').findOne({ 'username': username }, function (err, resulet1) {
        console.log(resulet1.username);
        if (!_.isNil(resulet1)) {

            errMsg.msg = '该用户已存在';
            return res.json(utils.resJSON(errCodes.REGIST_ERR, '该用户已存在', null, errMsg));
        }
        let query = { 'username': username, 'password': password };
        dbDriver.collection('usertb').insert(query, function (err, result) {
            if (err) {
                errMsg.msg = 'regist err';

                return res.json(utils.resJSON(errCodes.REGIST_ERR, '注册失败', null, errMsg));
            }
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, '注册成功', { username }, errMsg));
        });
    });
});

module.exports = router;