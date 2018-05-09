/**
 * Created by LJ on 11/22/15.
 */

'use strict';
var moment = require('moment');
var logger = require('./logger').logger;
var _ = require('lodash');
var assert = require('assert');
var config = require('config');
var enums = require('./enum');
var os = require('os');

// Get server eth0 ipv4 address and port to use trace log id
// https://nodejs.org/api/os.html#os_os_networkinterfaces
function getServerLocalAddressAndPort() {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var ad = interfaces[k][k2];
            if (ad.family === 'IPv4' && !ad['internal']) {
                addresses.push(ad.address);
            }
        }
    }
    var ip = _.isEmpty(addresses) ? '127.0.0.1' : addresses[0];
    var port = process.env.SERVICE_PORT || config['app']['port'] || 8156;
    return ip + ':' + port;
}

/**
 * 解析json 处理为 null的情况
 * @param str
 * @returns {*}
 */
function parseJSON(str) {
    var obj = null;
    try {
        obj = JSON.parse(str);
    } catch (e) {
    }
    return typeof obj === 'object' ? obj : null;
}

/**
 * 判断是否为Null
 * @param obj
 * @returns {boolean}
 */
function isNull(obj) {
    return obj === null;
}

/**
 * 判断是否为undefined
 * @param obj
 * @returns {boolean}
 */
function isUndefined(obj) {
    return obj === void 0;
}

/**
 * 判断是否为空
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    if (obj) {
        for (var key in obj) {
            return !hasOwn(obj, key);
        }
    }
    return true;
}

/**
 * 检查原型链是否含有该属性
 * @param obj
 * @param key
 * @returns {boolean}
 */
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 生成JSON的返回值并打印log
 * @param code
 * @param msg
 * @param data
 * @param errMsg
 * @returns {{code: *, msg: *, data: *}}
 */
function resJSON(code, msg, data, errMsg) {
    var result = {
        code: code,
        msg: msg,
        data: data
    };

    if (!_.isUndefined(errMsg)) {
        var level = _.isUndefined(errMsg['logLevel']) ? 'info' : errMsg['logLevel'];
        logger[level]('==code:' + code + '==errMsg:' + JSON.stringify(errMsg) + '==');
    } else {
        logger.error('No errMsg on' + code);
    }
    return result;
}

/**
 * 生成JSON的返回值并打印log(FULL_LOG=on)
 * @param code
 * @param msg
 * @param data
 * @param errMsg
 * @returns {{code: *, msg: *, data: *}}
 */
function resJSON_FULL_LOG(code, msg, data, errMsg) {
    var result = {
        code: code,
        msg: msg,
        data: data
    };

    if (!_.isUndefined(errMsg)) {
        var level = _.isUndefined(errMsg['logLevel']) ? 'info' : errMsg['logLevel'];
        var reqSeqHead = _.isNumber(errMsg.reqSeq) ? `[${errMsg.reqSeq}]` : '';
        delete errMsg.reqSeq;
        logger[level](reqSeqHead + '==code:' + code + '==errMsg:' + JSON.stringify(errMsg) + '==');
    } else {
        logger.error('No errMsg on' + code);
    }
    return result;
}

/**
 * 生成标准时间
 * @returns {*}
 */
function genNow() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 格式化一个时间字符串
 * @param time
 * @param format
 * @returns {*}
 */
function timeString(time, format) {
    var form = format ? format : 'YYYY-MM-DD HH:mm:ss';
    return moment(time).format(form);
}

/**
 * 参数检查
 * @param params
 * @returns {boolean}
 */
function checkParams(params) {
    for (var p in params) {
        if (_.isNull(params[p])) return false;
    }
    return true;
}

/**
 * 生成更新对象
 * */
function genUpdate(params) {
    var update = {};
    for (var p in params) {
        if (!_.isUndefined(params[p])) {
            update[p] = params[p];
        }
    }
    return update;
}
/**
 * 生成指定key的map
 * @param arr
 * @param key
 * @returns {*}
 */
function genMap(arr, key) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        var k = arr[i][key];
        var v = arr[i];
        map[k] = v;
    }
    return map;
}

/**
 * 生成指定的key 和 value的map
 * @param arr
 * @param key
 * @param value
 * @returns {*}
 */
function genMapPair(arr, key, value) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        var k = arr[i][key];
        var v = arr[i][value];
        map[k] = v;
    }
    return map;
}
/**
 * 在制定的Array中查找对应key的element
 * @param arr
 * @param key
 * @param value
 * @returns {*}
 */
function getSpecElement(arr, key, value) {
    var result = null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            result = arr[i];
            break;
        }
    }
    return result;
}

/**
 * 检查Obj中是否含有property属性，有返回值，or defaults null
 * @param obj
 * @param property
 * @returns {*}
 */
function defaultProterty(obj, property) {
    return obj.hasOwnProperty(property) ? obj.property : null;
}

/**
 * 检查值是否在map中
 * @param value
 * @param map
 * @return bool
 */
function isMapValue(value, map) {
    var isIn = false;
    for (var key in map) {
        if (map.hasOwnProperty(key) && value == map[key]) {
            isIn = true;
            break;
        }
    }
    return isIn;
}

/**
 * 批量检查值是否在map中
 * @param valueArr
 * @param map
 * @returns {boolean}
 */
function isMapValueBatch(valueArr, map) {
    var isIn = true;
    for (var i = 0; i < valueArr.length; i++) {
        if (!isMapValue(valueArr[i], map)) {
            isIn = false;
            break;
        }
    }
    return isIn;
}

function getRandomString(length, type) {
    if (type == 'n') {
        // TODO: possible not enough length
        return ('' + Math.random()).substring(2, 2 + length);
    } else {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
}

function isMailAddress(addressString) {
    // The regex matched RFC822/RFC2822 is too long and time-costing,
    // so just a really simple version here.
    if (!addressString || addressString.length < 3) {
        return false;
    }
    var index = addressString.indexOf('@');
    if (index == -1 || index == 0 || index == addressString.length - 1) {
        return false;
    }
    return true;
}

function isEmailAddress(emailString) {
    // Regex version to check emailAddress.
    if (typeof emailString !== 'string') return false;
    var regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return regex.test(emailString);
}

function isPhoneNumber(phoneString) {
    if (typeof phoneString !== 'string') return false;
    var regex = /^\d{11}$/;
    return regex.test(phoneString);
}

function isQQNumber(QQString) {
    if (typeof QQString !== 'string')   return false;
    var regex = /^\d{5,10}$/;
    return regex.test(QQString);
}

function isMaskedPhoneNumber(phoneString) {
    if (!phoneString) return false;
    var number = phoneString.replace(/\*/g, '0');
    return isPhoneNumber(number);
}

function isLoginName(nameString) {
    if (!nameString) return false;
    var regex = /^[a-zA-Z][\da-zA-Z\-]{5,29}$/;
    return regex.test(nameString);
}

function isRegisterName(nameString) {
    if (!nameString) return false;
    var regex = /^[a-zA-Z][\da-zA-Z]{5,29}$/;
    return regex.test(nameString);
}

function isMD5(md5String) {
    if (!md5String) return false;
    var regex = /^[a-fA-F0-9]{32}$/;
    return regex.test(md5String);
}

function isIPv4(ipString) {
    if (!ipString) return false;
    var fragments = ipString.split('.');
    if (fragments.length != 4) return false;
    var ipv4p = true;
    for (var i = 0; i < 4; i++) {
        if (!(fragments[i] <= 255 && fragments[i] >= 0)) {
            ipv4p = false;
            break;
        }
    }

    return ipv4p;
}

function renderTemplate(template, placeholder) {
    var result = template;
    for (var k in placeholder) {
        var regex = new RegExp('\\${' + k + '}', 'g');
        result = result.replace(regex, placeholder[k]);
    }
    return result;
}

function maskString(str, type) {
    var masked = '';
    if (!str || typeof str != 'string') return null;
    switch (type) {
        case 'name':
            masked = str.substring(0, 1) + '*******'.substring(0, str.length - 1);
            break;
        case 'phone':
            masked = str.substring(0, 3) + '****' + str.substring(7);
            break;
        case 'email':
            var atIndex = str.indexOf('@');
            if (atIndex == -1) {
                break;
            } else if (atIndex > 4) {
                masked = str.substring(0, atIndex - 4) + '****' + str.substring(atIndex);
            } else {
                masked = str[0] + '****' + str.substring(atIndex);
            }
            break;
        default:
            break;
    }
    return masked;
}

function getSemester(time) {
    if (!(time instanceof Date)) time = new Date(time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var monthDate = month * 100 + date;

    // the second semester is from 0215 to 0815 every year
    var secondBegin = 215;
    var firstBegin = 816;

    var range = '';
    var yearString = '';

    if (monthDate >= secondBegin && monthDate < firstBegin) {
        range = year - 1;
        yearString = range.toString().slice(2) + '-' + year.toString().slice(2);
        return yearString + '学年下学期';
    } else {
        if (month <= 2) {
            range = year - 1;
            yearString = range.toString().slice(2) + '-' + year.toString().slice(2);
            return yearString + '学年上学期';
        } else if (month >= 8) {
            range = year + 1;
            yearString = year.toString().slice(2) + '-' + range.toString().slice(2);
            return yearString + '学年上学期';
        }
    }
}

function paddingObjectId(id) {
    id = id.toString();
    var idParts = id.split('.');
    id = idParts[idParts.length - 1];
    var oidPadding = '000000000000000000000000';
    return oidPadding.slice(0, oidPadding.length - id.length) + id;
}

function mirrorMap(map) {
    return Object.keys(map).reduce(function (mirrored, key) {
        mirrored[map[key]] = key;
        return mirrored;
    }, {});
}

/**
 * return true if date1 and date2 in the same Day
 * @param date1
 * @param date2
 * @returns {boolean}
 */
function isSameDate(date1, date2) {
    return date1.getDate() == date2.getDate()
        && date1.getMonth() == date2.getMonth()
        && date1.getFullYear() == date2.getFullYear();
}

function unwind(obj, key) {
    if (!obj || !(obj[key] instanceof Array)) return obj;

    var elems = obj[key];
    var objs = [];
    for (var i = 0; i < elems.length; i++) {
        var newObj = Object.assign({}, obj);
        newObj[key] = elems[i];
        objs.push(newObj);
    }

    return objs;
}

// Review: idea is great, syntax can be more elegant
// For a variable, there are only *type* and *value*, no reason to split type part
// for type: Should(Number), May(Enum.Good) (Use any token to replace Should, May stuff)
// can also be nested: verificationMsgToken:Should(['roleType:Should(enum.UserType)', 'phoneNumber:Should(Phone)'])
// And before implement by yourself, check if there's any NPM package can do the job, for example:
// https://www.npmjs.com/package/type-check

/**
 * 用于获取请求体中的参数 req.body or req.query
 * @param attrNames Array of attrs ['#attrname@attrType$'].
 * Start with '#' means it's a number.
 * Start with '!!' means it's a boolean.
 * End with '$' means it can be empty.
 * attrName@attrType '@' can do enum check.
 * @param from Data body.
 * @returns {object} requestData object if correct. attrName if any attr should appear but turns out to be not.
 * attrName[ENUM] means value is out of enums. attrName[TYPE] means wrong type of attr AND type covert failed.
 */
function buildRequestData(attrNames, from) {
    if (!(attrNames && from)) {
        logger.error('buildRequestData() error. attrNames or from is empty.');
        return null;
    }

    if (!_.isArray(attrNames)) {
        attrNames = [attrNames];
    }

    const resultObj = {};
    for (var index in attrNames) {
        let needToCheckEnum = false;
        if (attrNames.hasOwnProperty(index)) {
            var attrName = _.split(_.trim(attrNames[index], '#$!'), '@', 2)[0];
            var attrType = _.split(_.trim(attrNames[index], '#$!'), '@', 2)[1];

            if (_.indexOf(attrNames[index], '@') !== -1) {
                needToCheckEnum = true;
            }
            // 空值检查
            if (_.isEmpty(from[attrName]) && !_.isNumber(from[attrName]) && !_.isBoolean(from[attrName])) {
                if (_.endsWith(attrNames[index], '$')) {
                    continue;
                }
                return attrName;
            } else {
                // 根据类型赋值
                if (_.startsWith(attrNames[index], '#')) {          // Number类型
                    resultObj[attrName] = Number(from[attrName]);
                    if (_.isNaN(resultObj[attrName])) {
                        return attrName + '[TYPE]';
                    }
                } else if (_.startsWith(attrNames[index], '!!')) {  // Boolean类型
                    if (from[attrName] === true || from[attrName] === 'true') {
                        resultObj[attrName] = true;
                    } else if (from[attrName] === false || from[attrName] === 'false') {
                        resultObj[attrName] = false;
                    }  else {
                        return attrName + '[TYPE]';
                    }
                } else {
                    resultObj[attrName] = _.isObject(from[attrName]) || _.isBoolean(from[attrName]) ? from[attrName] : from[attrName].toString();
                }

                // Enum检查
                if (needToCheckEnum) {
                    assert(enums[attrType], 'Enum类型不存在-' + attrType);
                    if (!isMapValue(resultObj[attrName], enums[attrType])) {
                        return attrName + '[ENUM]';
                    }
                }
            }
        }
    }
    return resultObj;
}

function buildErrMsg(req, api) {
    return {
        ip: req.realIP,
        api: api,
        userId: req.userId,
        stuId: req.studentId,
        localAddress: req.localAddress,
        msg: null
    };
}

function buildErrMsg_FULL_LOG(req, api) {
    return {
        reqSeq: req.reqSeq,
        ip: req.realIP,
        api: api,
        userId: req.userId,
        stuId: req.studentId,
        localAddress: req.localAddress,
        msg: null
    };
}

/**
 * 根据商品类别和商品数量,返回特定的显示文本
 * @param type 商品类型, enum#Good
 * @param quantity 商品数量
 * @returns {string || null} 显示文本
 */
function genDisQuantity(type, quantity) {
    if (_.isEmpty(quantity) && !_.isNumber(quantity)) {
        return null;
    }

    var disQuantity = '';
    if (type === enums.Good.STUDYCOIN) {
        disQuantity = quantity + '个';
    } else { // 会员或学习包
        if (quantity === 1) {
            disQuantity = '一年';
        } else if (quantity === 0.5) {
            disQuantity = '半年';
        } else {
            disQuantity = Math.ceil(quantity) + '天';
        }
    }
    return disQuantity;
}

function pickColumnFromArray(arrayOfArray, column) {
    var out = [];
    for (var i = 0; i < arrayOfArray.length; i++) {
        out.push(arrayOfArray[i][column]);
    }
    return out;
}

// Time/Date relation helper
function getStartOfWeek(date, weekDiff) {
    weekDiff = weekDiff || 0;
    var result = new Date(date);
    var dayOfWeek = getDayOfWeek(result);
    var dayOfMonth = result.getDate();
    result.setDate(dayOfMonth - dayOfWeek + 1 + weekDiff * 7);
    return standardizeDate(result);
}

function getEndOfWeek(date, weekDiff) {
    weekDiff = weekDiff || 0;
    var result = new Date(date);
    var dayOfWeek = getDayOfWeek(result);
    var dayOfMonth = result.getDate();
    result.setDate(dayOfMonth - dayOfWeek + 1 + weekDiff * 7 + 7);
    return standardizeDate(result);
}

function getDayOfWeek(date) {
    return date.getDay() == 0 ? 7 : date.getDay();
}

function getStartOfDate(date) {
    var result = new Date(date);
    return standardizeDate(result);
}

function getStartOfMonth(date, monthDiff) {
    monthDiff = monthDiff || 0;
    var result = new Date(date);
    result.setDate(1);
    var month = result.getMonth();
    result.setMonth(month + monthDiff);
    return standardizeDate(result);
}

function getEndOfMonth(date, monthDiff) {
    monthDiff = monthDiff || 0;
    var result = new Date(date);
    var month = result.getMonth();
    result.setDate(1);
    result.setMonth(month + 1 + monthDiff);
    return standardizeDate(result);
}

function standardizeDate(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function isInTimeSpan(date, startTime, endTime) {
    return date.getTime() >= startTime.getTime() && date.getTime() < endTime.getTime();
}

/**
 * fake count num
 * the count will increase with time goes by
 * if anyone has more elegant way to realize this function, please change it!
 * @param startTime 开始计数时间(毫秒级13位) 对于某一个计数流程,必须使用一样的开始计数时间
 * @param basic 基础值
 * @param time 当前时间戳(毫秒级13位)
 * @returns {*}
 */
function genFakeCount(startTime, basic, time) {
    // var startTime = 1475912546;
    startTime = Math.floor(startTime / 1000);
    var now = Math.floor(time / 1000);
    // var basic = 3128;
    var difference = Math.ceil((now - startTime) / 60);
    var offset = Math.floor(Math.log(difference) / Math.log(1.25) * 100);
    return isNaN(offset) ? basic : basic + offset;
}

/**
 * 判断一个字符串是否能转换成24位的ObjectId
 * @param id {string}
 * @returns {boolean}
 */
function isObjectIdLike(id) {
    id = String(id);
    if (id.length >= 1 && id.length <= 24) {
        if (!Number.isNaN(Number('0x' + id))) return true;
    }
    return false;
}

module.exports = {
    getServerLocalAddressAndPort: getServerLocalAddressAndPort, // 获取本机IP和port
    isNull: isNull,                                 // 判断是否为空，废弃，建议使用underscore
    isUndefined: isUndefined,                       // 判断是否为undefined
    isEmpty: isEmpty,                               // 判断是否为空值，废弃，建议使用underscore
    genNow: genNow,                                 // 返回一个YYYY-MM-DD HH:mm:ss的标准时间字符串
    resJSON: process.env.FULL_LOG == 'on' ? resJSON_FULL_LOG : resJSON,                               // 生成返回信息
    parseJSON: parseJSON,                           // 反序列化参数，如果返回为空代表发生异常
    checkParams: checkParams,                       // 检查参数的合法性
    genUpdate: genUpdate,                           // 生成更新对象
    genMap: genMap,                                 // arg : arr, type
                                                    // return : map<type, peter>
    getSpecElement: getSpecElement,                 // arg : arr , key, value
                                                    // return : arr[i] or null
    defaultProterty: defaultProterty,               // arg : obj, property
                                                    // return property
    genMapPair: genMapPair,                         // arg : arr, key, value
                                                    // return : map<key, value>
    isMapValue: isMapValue,                         // arg : value, map
                                                    // return : bool
    isMapValueBatch: isMapValueBatch,               // arg: valueArr, map
                                                    // return : bool
    timeString: timeString,                         // 格式化一个时间字符串
    getRandomString: getRandomString,               // arg: length, type
                                                    // return: String
    buildRequestData: buildRequestData,
    buildErrMsg: process.env.FULL_LOG == 'on' ? buildErrMsg_FULL_LOG : buildErrMsg,
    genDisQuantity: genDisQuantity,
    isMailAddress: isMailAddress,
    isEmailAddress: isEmailAddress,
    isPhoneNumber: isPhoneNumber,
    isMaskedPhoneNumber: isMaskedPhoneNumber,
    isLoginName: isLoginName,
    isRegisterName: isRegisterName,
    isMD5: isMD5,
    isIPv4: isIPv4,
    isObjectIdLike: isObjectIdLike,
    isQQNumber: isQQNumber,

    renderTemplate: renderTemplate,                 // A simple template renderer, replace `${placeholder}`
                                                    // arg: template, args
                                                    // return: String
    maskString: maskString,                         // arg: str, type
                                                    // return: String
    getSemester: getSemester,                       // 生成学年信息

    paddingObjectId: paddingObjectId,

    genFakeCount: genFakeCount,

    mirrorMap: mirrorMap,
    isSameDate: isSameDate,

    unwind: unwind,
    pickColumnFromArray: pickColumnFromArray,

    // time helper
    getStartOfDate: getStartOfDate,
    getStartOfWeek: getStartOfWeek,
    getEndOfWeek: getEndOfWeek,
    getStartOfMonth: getStartOfMonth,
    getEndOfMonth: getEndOfMonth,
    isInTimeSpan: isInTimeSpan
};
