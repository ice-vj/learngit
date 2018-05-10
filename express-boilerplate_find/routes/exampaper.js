
'use strict';
const express = require('express');
const router = express.Router();
const Thenjs = require('thenjs');
const _ = require('lodash');
const apis = require('../lib/api');
const errCodes = require('../lib/error');
const utils = require('../lib/utils');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb'); // or ObjectID 
const exampaper = require('../lib/dbDriver').get().collection('exampaper');
//mongodb://kb_dev:kb_dev@172.31.16.23:27017/test_kb;
/**
 * 获取试卷信息
 */
 router.get('/showpaper', function (req, res){

    let errMsg = utils.buildErrMsg(req, apis.SHOWPAPER);
    let que = {};
    //获取地名信息
    if(req.query['region']){
        que['region'] = req.query['region'];
    }
    if(req.query['name']){
        que['name'] = req.query['name'];
    }
    if(req.query['grade']){
        que['grade'] = req.query['grade'];
    }
    if(req.query['period']){
        que['period'] = req.query['period'];
    }
    if(req.query['subject']){
        que['subject'] = req.query['subject'];
    }
    if(req.query['city']){
        que['city'] = req.query['city'];
    }
    //分页信息
    let limit;
    let currentPage;
    if(req.params['limit']){
        limit = req.params['limit'];
    }else{
        limit = 10;
    }
    if(req.params['currentPage']){
        //加上合法判断
        currentPage = req.params['currentPage'];
    }else{
        currentPage = 1;
    }
    //没拿到地区
    if (_.isNil(que)){
        errMsg.msg = '数据没拿到';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, errMsg.msg, null, errMsg));
    }
    Thenjs(function(cont){
        console.log(que);
        //拿到符合条件总条数
        exampaper.count(que, function(err, count){
            if(err){
                return cont(err);
            }
            if(count === 0){
                errMsg.msg = '没有数据';
                let jsonMSG = utils.resJSON(errCodes.SHOWPAPER_ERR, errMsg.msg, null, errMsg);
                return res.json(jsonMSG);
            }
            return cont(null, count);
        });
    }).then(function(cont, count){
        //获取总页数
        let totalpage = Math.floor(count / limit);
        //如果最后一页不到limit行数，总页数+1
        if (count % limit !== 0) {
            totalpage += 1;
        }
        //如果当前页比最大页数大，则转到最后一页
        if (currentPage > totalpage) {
            currentPage = totalpage;
        }
        //进行分页 
        let skips = (currentPage - 1) * limit;
        exampaper.find(que).skip(skips).limit(limit).toArray(function(err, result){
            if(err){
                return cont(err);
            }
            if(result.length === 0){
                errMsg.msg = '没有数据';
                let jsonMSG = utils.resJSON(errCodes.SHOWPAPER_ERR, errMsg.msg, null, errMsg);
                return res.json(jsonMSG);
            }
            let jsonArray = {totalCount: count, data: result};
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, errMsg.msg, jsonArray, errMsg));
        });
    }).fail(function(cont, err){
        errMsg.msg = '数据库错误';
        return res.json(utils.resJSON(errCodes.DB_ERR, errMsg.msg, null, errMsg));
    }); 
});


module.exports = router;