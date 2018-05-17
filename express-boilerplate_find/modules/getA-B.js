const Thenjs = require('thenjs');
const fs = require('fs');
const lineread = require('line-reader');
const express = require('express');
const _ = require('lodash');
//查询文档是否存在
function checkfiles(file){
    if(file === '/' || file === ''){
        //return console.log('pathERR');
        return 'pathERR';
    }else{
        flag = fs.existsSync(__dirname + file);
        //console.log(flag);
        return flag;
    }
}
//归并排序
function mergetSort(arrLeft, arrRight) {
   
    // 合并有序序列
    function merge(arrLeft, arrRight) {
        let indexLeft = 0,
            indexRight = 0,
            sl = arrLeft.length,
            sr = arrRight.length,
            ret = [];
        while(true) {
            if(indexLeft < sl && indexRight < sr) {
                if(arrLeft[indexLeft] < arrRight[indexRight]) {
                    fs.appendFileSync(__dirname + '/' + 'Ao', arrLeft[indexLeft]);
                    indexLeft++;
                } else {
                    ret.push(arrRight[indexRight]);
                    indexRight++;
                }
            } else {
                if(indexLeft < indexRight) {
                    ret = ret.concat(arrLeft.slice(indexLeft));
                } else {
                    ret = ret.concat(arrRight.slice(indexRight));
                }
                break;
            }
        }
        return ret;
    }
}
//拆分文件
function splitFile(readstream, s, callback){
    let reading = '';
    readstreams.on('data', function(data){
        reading += data;
        s += 1024;
        callback(reading, s);
    })
}

function splitfile1(){
    let readstream = fs.createReadStream(__dirname + '/A.txt');
    splitfile2 (readstream, function(reading, s){
        fs.writeFileSync();
    })
}
    

//拆分文件，每个储存N行(splitFileUSE)
function dowmSplitFile(lines, flag, begin, end){
    if(!fs.existsSync(__dirname + '/' + flag)){
        fs.mkdirSync(__dirname + '/' + flag);
    }
    let lineStr = '';
    for(let j = begin; j < end; j++){
        if(!_.isNil(lines[j])){
            lineStr += lines[j];
        }
    }
    fs.writeFile(__dirname + '/' + flag + '/' + end/(end-begin), lineStr, function(err){
        if(err){
            return 'err';
        }
    });
}
//数组去空
function removeEmptyArrayEle(arr){    
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == undefined || arr[i] == '') {
            arr.splice(i,1);
            i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
        }
    }
     return arr;
  };
//对每个文件内容排序
function orderByFile(filePath, num){
    let content = fs.readFileSync(__dirname + '/' + filePath +'/' + num, 'utf8');
    let arr = content.split('\r');
    removeEmptyArrayEle(arr);
    arr.sort();
    let writecontent = '';
    for(let i = 0; i < arr.length; i++){
        writecontent += (arr[i] + '\r');
    }
    fs.writeFileSync(__dirname + '/' + filePath + '/' + num + filePath, writecontent, function(err){
        if(err){
            return console.log('shenmecuo');
        }
    });
}
//得到文档差集的文档
function differentSet(fileApath, fileBpath, fileCpath, callback){
    //查询文档是否存在
    let checkA = checkfiles(fileApath);
    let checkB = checkfiles(fileBpath);
    let checkC = checkfiles(fileCpath);
    if(checkA === 'pathERR' || checkB === 'pathERR' || checkC === 'pathERR'){
        //return console.log('pathERR');
        return callback('pathERR');
    }
    if(!checkA || !checkB){
        //return console.log('文件不存在');
        return callback('文件不存在');
    }
    if(!checkC){
        fs.writeFile(__dirname + fileCpath, '', function(err){
            if(err){
                //return console.log(err);;
                return callback('C文件创建失败');
            }
        });
    }
    Thenjs(function(cont){
       readline()
    }).then(function(cont){

    }).then(function(cont){
    
    }).then(function(cont){
    

    }).fail(function(cont, err){
        return callback('err');
    });  
}

differentSet('/A.txt', '/B.txt', '/C.txt', function(msg){
    console.log(msg);
});

module.exports = differentSet;