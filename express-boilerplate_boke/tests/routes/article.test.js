'use strict';
const superTest = require('supertest');
const should = require('should');

const peterMgr = require('peter').getManager('ut');
const config = require('config');

const MongoClient = require('mongodb').MongoClient;
const Thenjs = require('thenjs');
const _ = require('lodash');

const enums = require('../../lib/enum');
const errCodes = require('../../lib/error');
const common = require('../libs/common.test');
const utils = require('../../lib/utils');
const dbDriver = require('../../lib/dbDriver').get();
// 初始化获取app
let request;
before((done) => {
    common.getApp((err, ret) => {
        request = superTest(ret);
        done();
    });
});

// //添加文章
// describe('/addarticle', function () {
//     it('参数错误', function (done) {
//         request.post(`/article/addarticle`)
//             .expect(200)
//             .end((err, result) => {
//                 should.not.exists(err);
//                 result.body.code.should.equal(errCodes.PARAM_ERR);
//                 result.body.msg.should.equal('发表失败');
//                 done();
//             });
//     });

//     it('插入成功', function (done) {
//         request.post(`/article/addarticle`)
//             .set('Cookie', 'u_id=j%3A%225ae93fc3d3475837b0ff3bd7%22; Path=/' )
//             .send({
//                     title : '标题',
//                     content : '这是文章内容',
//                     classify : '测试',
//              })
//             .expect(200)
//             .end((err, result) => {
//                 should.not.exists(err);
//                 result.body.code.should.equal(errCodes.SUCCESS);
//                 result.body.msg.should.equal('OK');
//                 done();
//             });
//     });
// });

// //添加评论
// describe('/addTalk', function () {
//     it('参数错误', function (done) {
//         request.post(`/article/addTalk`)
//         .expect(200)
//         .end((err, result) => {
//             should.not.exists(err);
//             result.body.code.should.equal(errCodes.PARAM_ERR);
//             result.body.msg.should.equal('回复失败');
//             done();
//         });
//     });

//     it('插入成功', function (done) {
//         request.post(`/article/addTalk`)
//         .set('Cookie', 'u_id=j%3A%225ae93fc3d3475837b0ff3bd7%22; Path=/' )
//         .send({
//             art_id :'5aedb81254231a42f4f71f28',
//             talk : '你好',
//         })
//         .expect(200)
//         .end((err, result) => {
//             should.not.exists(err);
//             result.body.code.should.equal(errCodes.SUCCESS);
//             result.body.msg.should.equal('OK');
//             done();
//         });
//     });
// });    


//删除评论

// describe('/deleteTalk', function () {
    // it('没有拿到cooki', function (done) {
    //     request.delete(`/article/deleteTalk/1525614004084tid`)
    //     .send({
    //     })
    //     .expect(200)
    //     .end((err, result) => {
    //         should.not.exists(err);
    //         result.body.code.should.equal(errCodes.PARAM_ERR);
    //         result.body.msg.should.equal('没有登陆');
    //         done();
    //     });
    // });

//     it('删除成功', function (done) {
//         request.delete(`/article/deleteTalk/1525614004084tid`)
//         .set('Cookie', 'u_id=j%3A%225ae93fc3d3475837b0ff3bd7%22; Path=/' )
//         .send({
//         })
//         .expect(200)
//         .end((err, result) => {
//             should.not.exists(err);
//             result.body.code.should.equal(errCodes.SUCCESS);
//             result.body.msg.should.equal('删除成功');

//             done();
//         });
//     });
// });   


//添加文章
// describe('/addarticle', function () {
//     it('参数错误', function (done) {
//         request.post(`/bkarticle/addarticle`)
//             .expect(200)
//             .end((err, result) => {
//                 should.not.exists(err);
//                 result.body.code.should.equal(errCodes.PARAM_ERR);
//                 result.body.msg.should.equal('发表失败');
//                 done();
//             });
//     });

//     it('插入成功', function (done) {
//         request.post(`/bkarticle/addarticle`)
//             .set('Cookie', 'u_id=j%3A%225ae93fc3d3475837b0ff3bd7%22; Path=/')
//             .send({
//                 title: '标题1',
//                 content: '这是文章内容11',
//                 classify: '测试2',
//             })
//             .expect(200)
//             .end((err, result) => {
//                 should.not.exists(err);
//                 result.body.code.should.equal(errCodes.SUCCESS);
//                 result.body.msg.should.equal('OK');

//                 done();
//             });
//     });
// });