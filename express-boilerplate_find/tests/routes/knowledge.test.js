const config = require('config');
const expect = require('chai').expect;
const superagent = require('superagent');
const url = require('url');
const should = require('should');


const host = url.format({
	protocol: 'http',
	hostname: 'kb.gotiku.com',
	port: 18913
});
console.log(host);
const RETURN_CODE = {
	'OK': 00,                   // 处理成功
	'URL_ERROR': 01,            // api错误
	'AUTH_ERROR': 02,           // app_key, app_seceret认证信息错误
	'PARAMETERS_ERROR': 03,     // 上送参数错误
	'HANDLE_ERROR': 04,         // 业务处理错误
	'NULL_ERROR': 05,           // 空数据
	'EXCEED_FRQ_ERROR': 06,     // 访问频率过快
	'ILLEGAL_USER': 07,         // 被封的用户
	'NEED_VIP_ERROR': 08,      // 非会员
};

const RETURN_MSG = {
	'OK': 'OK',                                 // 处理成功
	'URL_ERROR': 'api not found',               // api错误
	'AUTH_ERROR': 'authentication error',   	// app_key, app_seceret认证信息错误
	'PARAMETERS_ERROR': 'parameters error',     // 上送参数错误
	'HANDLE_ERROR': 'servercie error',          // 业务处理错误
	'NULL_ERROR': 'cannot query data',          // 查询不到数据
	'EXCEED_FRQ_ERROR': 'api freq out of limit',// 访问频率过快
	'ILLEGAL_USER': 'user is untrusted',        // 被封的用户 
    'NEED_VIP_ERROR': 'user must be vip'       // 用户必须为vip才
};

//获取学生薄弱知识点
describe('获取学生薄弱知识点', function () {
    var url = [host, '/kboe_api/v2/student/weak/knowledges'].join('');
    it('stuId不存在', function (done) {
        superagent
        .get(url)
        .query({'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
            expect(res).to.not.be.an('null');
            //console.log(res);
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['PARAMETERS_ERROR']);
                expect(data.msg).to.be.equal('there must be stu_id and stu_id must number');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });
    it('stuId不为数字', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : 'asdasd','api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['PARAMETERS_ERROR']);
                expect(data.msg).to.be.equal('there must be stu_id and stu_id must number');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });

    it('拿到stuID,但没有查到记录', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : '321123132312213231', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['NULL_ERROR']);
                expect(data.msg).to.be.equal('cannot query data');

                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });
//业务处理错误
    it('拿到stuID', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : '9000000000245492', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.be.an('array');
                expect(data.length).not.equal(0);
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });   
});

//获取一个学生在学科上的知识点综合掌握情况
describe('获取一个学生在学科上的知识点综合掌握情况', function () {
    var url = [host, '/kboe_api/v2/student/knowledges'].join('');
    it('stuId不存在', function (done) {
        superagent
        .get(url)
        .query({'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){    
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['PARAMETERS_ERROR']);
                expect(data.msg).to.be.equal('there must be stu_id and stu_id must number');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });
    it('stuId不为数字', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : 'asdasd', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['PARAMETERS_ERROR']);
                expect(data.msg).to.be.equal('there must be stu_id and stu_id must number');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });

    it('拿到stuID,但没有查到记录', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : '321123132312213231', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['NULL_ERROR']);
                expect(data.msg).to.be.equal('cannot query data');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });

    it('拿到stuID，查到所有学科记录', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : '9000000000245492', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){

			expect(res).to.not.be.an('null');
            
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.be.an('array');
                expect(data.length).not.equal(0);
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });
    it('拿到stuID,查学科为数学的记录', function (done) {
        superagent
        .get(url)
        .query({'stu_id' : '9000000000245492', 'subject' : '数学', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                //console.log(data);
                expect(data).to.be.a('array');
                expect(data[0].subject).equal('数学')
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });   
});


//获取多道题（好分数）的知识点
describe('获取多道题（好分数）的知识点', function () {

    it('没有拿到数据', function (done) {
        var ques_id = '10884911-12,10884911-11,10884911-22';
        var url = [host, `/kboe_api/v2/hfs/questions/${ques_id}/knowledges`].join('');
        superagent
        .get(url)
        .query({'stu_id' : '9000000000245492', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
            
			expect(res).to.not.be.an('null');
            
            try{
                var data = JSON.parse(res.text);
                console.log(data);
                expect(data).to.have.keys('code', 'msg');
                expect(data.code).to.be.equal(RETURN_CODE['NULL_ERROR']);
                expect(data.msg).to.be.equal('你找的数据不存在');
                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });

    it('拿到数据', function (done) {
        var ques_id = '1088491-0,1088491-1,1088491-2';
        var url = [host, `/kboe_api/v2/hfs/questions/${ques_id}/knowledges`].join('');
        superagent
        .get(url)
        .query({'stu_id' : '9000000000245492', 'api_key' : 'iyunxiao_tester'})
        .end(function(err, res){
			expect(res).to.not.be.an('null');
            try{
                var data = JSON.parse(res.text);
                console.log(data);
                expect(data).to.be.an('array');
                expect(data.length).not.equal(0);

                done();
            }catch(e){
                expect(e).to.be.a('null');
                done();
            }
        });
    });   
});


