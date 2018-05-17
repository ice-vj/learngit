'use strict';
const superTest = require('supertest');
const should = require('should');
const _ = require('lodash');
const fs = require('fs');
const enums = require('../../lib/enum');
const AdifB = require('../../modules/v3.2');
const assert = require('assert');


//
describe('/differentSet()', function () {
    it('参数错误', function (done) {
        AdifB.differentSet('/a.txt','/q.txt','/c.txt', function(flag){
              flag.should.eql('文件不存在');
              done();
        });          
    });
    it('参数错误', function (done) {
        AdifB.differentSet('/a.txt','/','/c.txt', function(flag){
              flag.should.eql('pathERR');
              done();
        });     
    });
    it('正确', function (done) {
        AdifB.differentSet('/A.txt','/B.txt','/C.txt', function(flag){
              flag.should.eql('success');
              done();
        });       
    });

});

//mergetSort
describe('/mergetSort', function () {
    it('参数错误', function () {
        let a = [21, 34, 3, 56, 12, 5, 8];
        let b = [3, 5, 8, 12, 21, 34, 56];
        let result = AdifB.mergetSort(a);
        result.should.eql(b);
    });
    // it('参数错误', function (done) {
    //     AdifB.mergetSort('/a.txt','/','/c.txt', function(flag){
    //           flag.should.eql('pathERR');
    //           done();
    //     });     
    // });
    // it('正确', function (done) {
    //     AdifB.mergetSort('/A.txt','/B.txt','/C.txt', function(flag){
    //           flag.should.eql('success');
    //           done();
    //     });       
    // });

});
