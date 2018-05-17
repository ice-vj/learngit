const Thenjs = require('thenjs');
const fs = require('fs');
const rl = require('readline');
const express = require('express');
const _ = require('lodash');

//归并排序
function mergetSort(arr) {
    if(arr.length === 1) {
        return arr;
    }
    //数组二分
    let leftArr = arr.slice(0, Math.floor(arr.length / 2));
    let rightArr = arr.slice(leftArr.length);
    // 递归
    return merge(mergetSort(leftArr), mergetSort(rightArr));
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
                    ret.push(arrLeft[indexLeft]);
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
//查空
function checkfiles(file){
    if(file === '/' || file === ''){
        //return console.log('pathERR');
        return 'pathERR';
    }else{
        flag = fs.existsSync(__dirname + '/' + file);
        //console.log(flag);
        return flag;
    }
}
//求差集
function mergetdif(arrA, arrB){
    let indexA = 0,
        indexB = 0,
        sl = arrA.length,
        sr = arrB.length,
        ret = [];
    while(true) {
        if(indexA < sl && indexB < sr) {
            if(arrA[indexA] < arrB[indexB]) {
                ret.push(arrA[indexA]);
                indexA++;
            }else{
                indexA++;
                indexB++;
            }
        } else {
            if(indexA > indexB) {
                ret = ret.concat(arrA.slice(indexA));
            } 
            break;
        }
    }
    return ret;
}
//求A-B主函数
function differentSet(fileApath, fileBpath, fileCpath, callback){
    //查询文档是否存在
    let checkA = checkfiles(fileApath),
        checkB = checkfiles(fileBpath),
        checkC = checkfiles(fileCpath);
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
        let readstream = fs.createReadStream(__dirname + '/' + fileApath);
        let reading = '';
        readstream.on('data', function(data){
            reading += data;
            let result = reading.split('\r');
            let resultA = mergetSort(result);
            return cont(null, resultA);
        });
    }).then(function(cont, resultA){
        let readstream = fs.createReadStream(__dirname + '/' + fileBpath);
        let reading = '';
        readstream.on('data', function(data){
            reading += data;
            let result = reading.split('\r');
            let resultB = mergetSort(result);
            return cont(null, resultA, resultB);
        });
    }).then(function(cont, resultA, resultB){
        let result = mergetdif(resultA, resultB);
        let writes = result.join('\r');
        fs.writeFileSync(__dirname + '/' + fileCpath, writes);        
    }).fail(function(cont, err){
        return callback('err');
    });
}

differentSet('A.txt', 'B.txt', 'C.txt', function(msg){
    return console.log(msg);
});