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
const boke = require('../lib/dbDriver').get().collection('article_tb');

//根据不同条件查询发帖
router.post('/showtopical', function (req, res){

    let errMsg = utils.buildErrMsg(req, apis.SHOWTOP);
    let query = {};
    //获取地名信息
    if(req.body['title']){
        query['title'] = req.body['title'];
    }
    if(req.body['classify']){
        query['classify'] = req.body['classify'];
    }
    if(req.body['date']){
        query['date'] = req.body['date'];
    }
    
    //分页信息
    let limit;
    let currentPage;
    if(req.body['limit']){
        limit = req.body['limit'];
    }else{
        limit = 10;
    }
    if(req.body['currentPage']){
        //加上合法判断    
        currentPage = req.body['currentPage'];
    }else{
        currentPage = 1;
    }
    //没拿到地区
    if (_.isNil(query)){
        errMsg.msg = '数据没拿到';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, errMsg.msg, null, errMsg));
    }
    Thenjs(function(cont){
        // boke.createIndex()
        //拿到符合条件总条数
        boke.count(query, function(err, count){
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
        boke.find(query).skip(skips).limit(limit).toArray(function(err, result){
            if(err){
                return cont(err);
            }
            if(result.length === 0){
                errMsg.msg = '没有数据';
                let jsonMSG = utils.resJSON(errCodes.SHOWPAPER_ERR, errMsg.msg, null, errMsg);
                return res.json(jsonMSG);
            }
            return cont(null, count, result);
        });
    }).then(function(cont, count, result){
        let talks = [];
        //这个循环另写成一个方法
        for(let i = 0; i < result.length; i++){
            if(result[i].article.talks.length !== 0){         
                for(let j = 0; j < result[i].article.talks.length; j++){
                    talks = result[i].article.talks.filter(function(item){
                        return item.flag === 1;
                    });
                }
                result[i].article.talks = talks; 
            }       
        }
        let jsonArray = {totalCount: count, data: result};
        errMsg.msg = 'success';
        return res.json(utils.resJSON(errCodes.SUCCESS, errMsg.msg, jsonArray, errMsg));   
    }).fail(function(cont, err){
        errMsg.msg = '数据库错误';
        return res.json(utils.resJSON(errCodes.DB_ERR, errMsg.msg, null, errMsg));
    }); 
});

//添加帖子
router.post('/addtopical', function (req, res){

    let errMsg = utils.buildErrMsg(req, apis.ADDTOP);
    let article = {};
    
    if(req.cookies['u_id']){
        article['u_id'] = req.cookies['u_id']
    }
    if(req.body['title']){
        article['title'] = req.body['title'];
    }
    if(req.body['content']){
        article['content'] = req.body['content'];
    }
    if(req.body['classify']){
        article['c_id'] = req.body['classify']+'cid';
        article['classify'] = req.body['classify'];
    }
    //console.log(article);
  
    if (_.isNil(req.cookies.u_id) || _.isNil(article)){
        errMsg.msg = '没有登陆或数据没拿到';
        return res.json(utils.resJSON(errCodes.PARAM_ERR, errMsg.msg, null, errMsg));
    }else{
        article['date'] = new Date();
        article['talks'] = [];
    }
    Thenjs(function(cont){
        //console.log(article);
       
        boke.insertOne({article}, function(err, data){
            if(err){
                return cont(err);
            }
            console.log(data.result.n);
            
            if(data.result.n === 0){
                errMsg.msg = '新加失败';
                let jsonMSG = utils.resJSON(errCodes.SHOWPAPER_ERR, errMsg.msg, null, errMsg);
                return res.json(jsonMSG);
            }
            errMsg.msg = 'success';
            return res.json(utils.resJSON(errCodes.SUCCESS, errMsg.msg, data, errMsg));   
        });
    }).fail(function(cont, err){
        errMsg.msg = '数据库错误';
        return res.json(utils.resJSON(errCodes.DB_ERR, errMsg.msg, null, errMsg));
    }); 
});


module.exports = router;