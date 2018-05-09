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


function showPaperc(req, res){

    let errMsg = utils.buildErrMsg(req, apis.ADDACT);
    //获取地名信息
    let region = req.query.region;
    //获取分页信息
    let limit = req.param(limit, 10);
    let currentPage = req.param(currentPage, 1);
    //获取总页数
    let totalpage = Math.floor(data.length / limit);
    //如果最后一页不到limit行数，总页数+1
    //没拿到地区
    if (_.isNil(region)) {
        errMsg.msg = '数据没拿到';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, errMsg.msg, null, errMsg));
    }
    Thenjs(function(cont){
        let query = {'regin': regin};
        exampaper.find(query).toArray(function(err, data){
            if(err){
                return cont(err);
            }
            if(data.length === 0){
                errMsg.msg = '没有数据';
                let jsonMSG = utils.resJSON(errCodes.SHOWPAPER_ERR, errMsg.msg, null, errMsg);
                return res.json(jsonMSG);
            }
             //如果最后一页不到limit行数，总页数+1
            if (data.length % limit !== 0) {
                totalpage += 1;
            }
            //如果当前页比最大页数大，则转到最后一页
            if (currentPage > totalpage) {
                currentPage = totalpage;
            }
            return cont(null, data);
        }).then(function(cont, data){
            //进行分页
            let querys = exampaper.find(query);
            querys.skip((currentPage - 1) * limit);
            querys.limit(limit);
            querys.toArray(function (err, result) {
                let jsonArray = {totalCount: data.length, data: result};
                errMsg.msg = 'success';
                return res.json(utils.resJSON(errCodes.SUCCESS, errMsg.msg, jsonArray, errMsg));
            });
        }).fail(function(cont, err){
            errMsg.msg = '数据库错误';
            return res.json(utils.resJSON(errCodes.DB_ERR, errmsg.msg, null, errMsg));
        });
    });
}



// //根据地区查找
// router.get('/findpaperBygrade', function (req, res) {

//     let errMsg = utils.buildErrMsg(req, apis.ADDACT);
//     //获取地区信息
//     let region = req.query.region;
//     //console.log(region);
//     //没拿到地区
//     if (_.isNil(region)) {
//         errMsg.msg = '数据没拿到';
//         return res.json(utils.resJSON(errCodes.PARAM_ERR, errMsg.msg, null, errMsg));
//     }
//     //拿到地区查询
//     let query = {'region': region};
//     exampaper.find(query).toArray(function (err, data) {
//         if (err) {
//             console.log(err);
//             errMsg.msg = '数据库错误';
//             return res.json(utils.resJSON(errCodes.DB_ERR, '数据库错误', null, errMsg));
//         }
//         if (data.length === 0) {//没得到数据
//             errMsg.msg = '没有数据';
//             return res.json(utils.resJSON(errCodes.SHOWPAPER_ERR, '没有数据', null, errMsg));
//         } else {
//             //console.log(data.length);
//             //获取分页信息
//             let limit = req.param(limit,10);
//             let currentPage = req.param(currentPage,1);
//             //获取总页数
//             let totalpage = Math.floor(data.length / limit);
//             //如果最后一页不到limit行数，总页数+1
//             if (data.length % limit !== 0) {
//                 totalpage += 1;
//             }
//             //如果当前页比最大页数大，则转到最后一页
//             if (currentPage > totalpage) {
//                 currentPage = totalpage;
//             }
//             //进行分页
//             var querys = exampaper.find(query);
//             querys.skip((currentPage - 1) * limit);
//             querys.limit(limit);
//             querys.toArray(function (err, result) {
//                 let jsonArray = {totalCount: data.length, data: result};
//                 errMsg.msg = 'success';
//                 return res.json(utils.resJSON(errCodes.SUCCESS, 'OK', jsonArray, errMsg));
//             });
//         }
//     });

// });
//示例
//function (req, res) {
//     let errMsg = utils.buildErrMsg(req, apis.);

//     if (_.isNil()) {
//         errMsg.msg = 'Param field missed.';
//         return res.json(utils.resJSON(errCodes.PARAM_ERR, '参数错误', null, errMsg));
//     }

//     Thenjs(function (cont) {
        
//     }).then(function (cont, arg) {
        
//     }).fin(function (cont, err, arg) {
//         if (err) {
//             errMsg.msg = ' err';
//             errMsg.logLevel = 'error';
//             errMsg.errStack = err.stack || err;
//             return res.json(utils.resJSON(errCodes., '错误', null, errMsg));
//         }

//         errMsg.msg = 'success';
//         return res.json(utils.resJSON(errCodes.SUCCESS, '成功', result, errMsg));
//     });
// });
module.exports = {
    showPaper: showPaper,
}