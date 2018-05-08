/**
* Created by kevin on 20171011
*/
'use strict';
const superTest = require('supertest');
const should = require('should');

const peterMgr = require('peter').getManager('ut');
const config = require('config');
const mongoAddr = config.get('mongo.uri');

const Thenjs = require('thenjs');
const _ = require('lodash');

const enums = require('../../lib/enum');
const errCodes = require('../../lib/error');
const common = require('../libs/common.test');

// 初始化获取app
let request;
before((done) => {
    common.getApp((err, ret) => {
        request = superTest(ret);
        done();
    });
});

describe('/health', function () {
    it('default', function (done) {
        request.get(`/healthcheck`)
            .expect(200)
            .end((err, result) => {
                should.not.exists(err);
                result.body.code.should.equal(errCodes.SUCCESS);
                done();
            });
    });
});