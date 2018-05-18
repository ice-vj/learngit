/**
 * Module dependencies.
 */
// const Thenjs = require('thenjs');
const _ = require('underscore');
const Config = require('config');

const Logger = require('../../common/utils/logger');
const ResponseWrapper = require('../../common/utils/response_wrapper');
const stuKnsClassify = require('./utils.js').stu_kns_classify;
const convertLevel = require('./utils.js').convert_level;

const subjectsSet = new Set(Config.get('subjects'));
const mongodber = require('../../common/utils/mongodber');
const db = mongodber.use('KBOE');
const memory = require('../../common/utils/memory');

/**
 * desc: 通过学生薄弱知识点，和知识点ID-KNOW的映射来将知识点
 *          转换为目标格式。
 * params:
 *   in:
 *         @inData: 薄弱知识点的原始数据
 *         @kv: 知识点ID，与知识点Object的Object
 * --------------------------------------------------------------
 *  author:cuiyunfeng
 *  last-modified-date:2016-06-22 11:57
 */
function doWeakKnow(inData, kv) {
    let retvalJSON = _.map(inData, function(subjectData) {
        let retobj = {};
        retobj['knowledges'] = [];
        retobj['subject'] = subjectData['subject'];
        for (let knowData of subjectData['knowledges']) {
            try {
                let kid = knowData['id'];
                if (kv.hasOwnProperty(kid)) {
                    let retkn = {};
                    retkn['id'] = kid;
                    retkn['name'] = kv[kid]['name'];
                    retkn['chance'] = kv[kid]['chance'];
                    retkn['score'] = kv[kid]['score'];
                    retkn['level'] = convertLevel(knowData['level']);
                    // 新增练习知识点可能灭有考试试题
                    if (knowData.exam_questions) {
                        retkn['ques_num'] = knowData.exam_questions.length;
                        retkn['lscore'] = 0;
                        for (let ques of knowData.exam_questions) {
                            if (ques.lscore) {
                                retkn['lscore'] += ques.lscore;
                            }
                        }
                    } else {
                        retkn['ques_num'] = 0;
                        retkn['lscore'] = 0;
                    }
                    retobj['knowledges'].push(retkn);
                }
            } catch (err) {
                Logger.error(err);
            }
        }
        return retobj;
    });
    return retvalJSON;
}

/**
 * desc: 通过学生掌握综合知识点，知识点ID-KNOW的映射来将知识点
 *          转换为目标格式。
 * params:
 *   in:
 *         @inData: 综合知识点的原始数据
 *         @kv: 知识点ID，与知识点Object的Object
 * --------------------------------------------------------------
 *  author:cuiyunfeng
 *  last-modified-date:2016-05-15 15:36
 */
function doStuKnow(inData, kv) {
    let retvalJSON = _.map(inData, function(subjectData) {
        let subjectObj = {
            'subject': subjectData['subject'],
            'levels': [],
        };
        for (let oneLevelData of subjectData['levels']) {
            let levelObj = {
                'level': oneLevelData['level'],
                'num': oneLevelData['num'],
                'knowledges': [],
            };
            for (let oneKnowData of oneLevelData['knowledges']) {
                let kid = oneKnowData['id'];
                if (kv[kid] && kv[kid] && kv[kid]['name']) {
                    let knowObj = {
                        'id': kid,
                        'name': kv[kid]['name'],
                        'chance': kv[kid]['chance'],
                        'score': kv[kid]['score'],
                    };
                    levelObj['knowledges'].push(knowObj);
                }
            }
            subjectObj['levels'].push(levelObj);
        }
        return subjectObj;
    }); // end map json
    return retvalJSON;
}

/**
 * desc: 获取多道题（好分数）的知识点，和知识点ID-KNOW的映射来
 *          将知识点转换为目标格式。
 * params:
 *   in:
 *         @inData: 试题中的知识点原生数据
 *         @kv: 知识点ID，与知识点Object的Object
 * --------------------------------------------------------------
 *  author:cuiyunfeng
 *  last-modified-date:2016-06-22 12:30
 */
function doQuesKnow(inData, kv) {
    let retvalJSON = _.map(inData, function(ques) {
        let objQues = {};
        objQues['ques_id'] = ques['_id'];
        objQues['knowledges'] = _.map(ques['knowledges'], function(kn) {
            let retkn = {};
            let kid = kn['id'];
            retkn['id'] = kid;
            retkn['name'] = kv[kid]['name'];
            retkn['chance'] = kv[kid]['chance'];
            retkn['score'] = kv[kid]['score'];
            return retkn;
        });
        return objQues;
    });
    return retvalJSON;
}

/**
 * desc: 通过知识点的ID，将知识点添加name, chance以及score.
 * params:
 *   in:
 *         @knows: 没有详细属性的知识点List
 *         @knowIds: 知识点ID List
 *         @res: node的response对象
 *         @callback: 原型为function(know, kv)的回调函数用来完成
 *                    数据格式调整的功能。
 * --------------------------------------------------------------
 *  author:cuiyunfeng
 *  last-modified-date:2016-06-22 11:48
 */
function basicKnowledgeQuestion(knows, knowIds, res, callback) {
    return function(err, docs) {
        let responseWrapper = new ResponseWrapper(res);
        if (docs.length <= 0) {
            return responseWrapper.error('NULL_ERROR', '你找的数据不存在');
        }
        let kv = {};
        for (let doc of docs) {
            if (knowIds.has(doc['_id'])) {
                kv[doc['_id']] = doc;
            }
        }
        let retvalJSON = callback(knows, kv);
        return responseWrapper.succ(retvalJSON);
    };
}

/**
 * desc: 获取学生薄弱知识点
 * API: /kboe/v1/student/weak/knowledges/
 * params:
 *       input: stu_id(int)
 *       output:
 *         [{
 *             subject: *,
 *             knowledges: [{
 *                 id: *,     # 知识点id
 *                 name: *,   # 知识点名称
 *                 score: *,  # 知识点近5年的得分平均
 *                 chance: *, # 知识点在近5年考核的概率
 *                 level: *,  # 学生对知识点掌握层级
 *             }, ...]
 *         }, ...]
 * -------------------------------------------------------------------
 * author: cuiyunfeng
 * last-modified-date: 2016-09-30 15:20
 */
function weakKnow(req, res) {
    let responseWrapper = new ResponseWrapper(res);
    // stuId 必须存在，而且必须是数字
    let stuId = Number(req.query['stu_id']);
    if (!stuId) {
        return responseWrapper.error('PARAMETERS_ERROR', 'there must be stu_id and stu_id must number');
    }
    let cond = {'_id': stuId};
    let proj = {'abilities.level': 1,
                'abilities.subject': 1,
                'abilities.knowledges.id': 1,
                'abilities.knowledges.level': 1,
                'abilities.knowledges.exam_questions.lscore': 1,
    };
    let cursorStu = db.collection('student').find(cond, proj);
    cursorStu.toArray(function(err, docs) {
        // 2016-09-30 modified
        if (err || !(docs instanceof Array)) {
            return responseWrapper.error('HANDLE_ERROR');
        }
        if (docs.length <= 0) {
            return responseWrapper.error('NULL_ERROR');
        }
        let student = docs[0];
        let weakKnowledges = [];
        let knowIds = new Set();
        // 筛选出符合条件的知识点
        let subKnCats = stuKnsClassify(student);
        for (let sub in subKnCats) {
            if (!subKnCats.hasOwnProperty(sub)) {
                continue;
            }
            if (!subjectsSet.has(sub)) {
                continue;
            }
            let badKns = subKnCats[sub]['bad_kns'];
            for (let kn of badKns) {
                knowIds.add(kn.id);
            }
            let retval = {
                'subject': sub,
                'knowledges': badKns,
                'level': subKnCats[sub]['level'],
            };
            weakKnowledges.push(retval);
        }
        if (knowIds.size <= 0) {
            return responseWrapper.error('NULL_ERROR', '没有薄弱知识点');
        }

        let funcWeakKnow = basicKnowledgeQuestion(
                                weakKnowledges,
                                knowIds,
                                res,
                                doWeakKnow);
        fields = ['_id', 'score', 'chance', 'name'];
        memory.find('knowledge_question',
                    {'_id': {'$in': Array.from(knowIds)}},
                    fields,
                    funcWeakKnow);
    });
}

/**
 * desc: 获取一个学生在学科上的知识点综合掌握情况
 * API: /kboe/v1/student/knowledges
 * params:
 *       input: stu_id(int)
 *       output:
 *       [{
 *        subject: *,
 *        levels:[{
 *          level: *, # 对知识点掌握层级
 *          num : *,  # 该层级上包含知识点数目
 *          knowledges: [{
 *            id: *,     # 知识点id
 *            name: *,   # 知识点名称
 *            score: *,  # 知识点近5年的得分平均
 *            chance: *, # 知识点在近5年考核的概率
 *          }, ...]
 *        }, ...]
 *      }, ...]
 -------------------------------------------------------------------
 * author: cuiyunfeng
 * last-modified-date: 2016-06-22 11:20
 */
function stuKnow(req, res) {
    let responseWrapper = new ResponseWrapper(res);
    let subject = req.query['subject'];
    // 输入参数的校验
    let stuId = Number(req.query['stu_id']);
    if (!stuId) {
        return responseWrapper.error('PARAMETERS_ERROR', 'there must be stu_id and stu_id must number');
    }
    let cond = {'_id': stuId};
    let proj = {'abilities.level': 1,
                'abilities.subject': 1,
                'abilities.knowledges.id': 1,
                'abilities.knowledges.level': 1,
    };
    if (subject) {
        proj['abilities'] = {
            '$elemMatch': {'subject': subject},
        };
    }
    let stuCur = db.collection('student').find(cond, proj);
    stuCur.toArray(function(err, docs) {
        if (err) {
            return responseWrapper.error('HANDLE_ERROR');
        }
        if (docs.length <= 0) {
            return responseWrapper.error('NULL_ERROR');
        }
        let student = docs[0];
        if (!student || !student['abilities']) {
            return responseWrapper.error('NULL_ERROR');
        }

        // 根据条件来筛选出所有符合条件的知识点，同时获取出知识点id
        let knowIds = new Set();
        let knowledgeLevel = _.map(student['abilities'], function(subjectData) {
            let subjectLevel = {};
            let levels = {};
            subjectLevel['subject'] = subjectData['subject'];
            subjectLevel['levels'] = [];
            for (let knowledge of subjectData['knowledges']) {
                let levelNum = convertLevel(knowledge['level']);
                if (!levels[levelNum]) {
                    levels[levelNum] = [];
                }
                levels[levelNum].push(knowledge);
                 if (Number(knowledge['id'])) {
                    knowIds.add(Number(knowledge['id']));
                }
            }
            for (let levelNum in levels) {
                if (!levels.hasOwnProperty(levelNum)) {
                    continue;
                }
                let retval = {
                    'level': levelNum,
                    'num': levels[levelNum].length,
                    'knowledges': levels[levelNum],
                };
                subjectLevel['levels'].push(retval);
            }
            return subjectLevel;
        });

        let funcStuKnow = basicKnowledgeQuestion(knowledgeLevel,
                                                 knowIds,
                                                 res,
                                                 doStuKnow);
        fields = ['_id', 'score', 'chance', 'name'];
        memory.find('knowledge_question',
                    {'_id': {'$in': Array.from(knowIds)}},
                    fields,
                    funcStuKnow);
    });
}

/**
 * desc: 获取多道题（好分数）的知识点
 * API: /kboe/v1/hfs/questions/{ques_id}/knowledges/
 * params:
 *       in:
 *           @ques_id(string): 好粉试题id(支持多个试题，用逗号分割
 *       output:
 *         [{
 *           ques_id: *,   # 好分数试题的id
 *           knowledges:[{
 *             id: *,     # 知识点id
 *             name: *,   # 知识点名称
 *             score: *,  # 知识点近5年的得分平均
 *             chance: *, # 知识点在近5年考核的概率
 *           }, ...],
 *         }, ...]
 * ------------------------------------------------------------------
 * author: cuiyunfeng
 * last-modified-date: 2016-06-22 11:26
 */
function quesKnow(req, res) {
    let responseWrapper = new ResponseWrapper(res);
    // 首先还是要先验证输入信息的合法性
    let quesIds = null;
    try {
        quesIds = req.params.ques_id.split(',');
    } catch (e) {
        // 这里可能会产生一个异常
        return responseWrapper.error('PARAMETERS_ERROR', 'unknow error with ques_id');
    }

    // 对于db的合法性依然要验证
    db.collection('mark_question').find({'_id': {'$in': quesIds}}).toArray(function(err, questions) {
        if (err) {
            return responseWrapper.error('HANDLE_ERROR');
        }
        // 先检验是否有数据返回
        if (questions.length <= 0) {
            return responseWrapper.error('NULL_ERROR', '你找的数据不存在');
        }
        // 要先获取knowledge id list
        let knowIds = new Set();
        for (question of questions) {
            for (knowledge of question['knowledges']) {
                knowIds.add(knowledge['id']);
            }
        }
        let funcQuesKnow = basicKnowledgeQuestion(questions,
                                                  knowIds,
                                                  res,
                                                  doQuesKnow);
        fields = ['_id', 'score', 'chance', 'name'];
        memory.find('knowledge_question',
                    {'_id': {'$in': Array.from(knowIds)}},
                    fields,
                    funcQuesKnow);
    });
}

module.exports = {
    weak_know: weakKnow,
    ques_know: quesKnow,
    stu_know: stuKnow,
};

