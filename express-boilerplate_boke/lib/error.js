/**
 * Created by LJ on 11/22/15.
 */
var utils = require('./utils');

function errorHandler(res, error, errorCode, errMsg) {
    errMsg['logLevel'] = 'error';
    errMsg['errStack'] = error.stack || error;
    return res.json(utils.resJSON(errorCode, errMsg.msg, null, errMsg));
}

module.exports = {
    errorHandler: errorHandler,         // 异常程序捕获
    // Success
    SUCCESS: 0,                         // 成功
    NO_ITEM_NOW: 1,                     // 成功，但是现阶段确实没有数据

    // General Error
    INTERNAL_ERR: 1000,                 // 内部错误
    PARAM_ERR: 1001,                    // 参数错误
    GLOBAL_ERR: 1002,                   // 全局异常
    DB_ERR : 10001111,

    //user
    REGIST_ERR:10001,      //注册失败
    LOGIN_ERR:10002,       //登陆失败

    //article
    ADDARC_ERR:10010,       
    TALK_ERR:10011,
    SHOWTITLE_ERR:10012,
    SHOWCLASS_ERR:10013,

    
};