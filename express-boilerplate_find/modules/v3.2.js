const Thenjs = require('thenjs');
const fs = require('fs');
const readline = require('lei-stream').readLine;
const writeline = require('lei-stream').writeLine;
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
            }else if(arrA[indexA] === arrB[indexB]){
                indexA++;
            }else{
                indexB++;
            }
        }else{
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
        let counter = 0;
        let filenum = 1;
        let inputFile = fs.createReadStream(__dirname + '/' + fileApath);
        let arr = [];
        readline(inputFile).go(function (data, next) {
            counter++;
            arr.push(data);
            if(counter % 2 === 0) {
                arr.sort();
                let reading = arr.join('');
                fs.writeFileSync(__dirname + '/A/' + filenum, reading);
                filenum++;
                arr = [];
            }
            next();
        }, function () {
            fs.writeFileSync(__dirname + '/A/' + filenum, arr[0]);
        });
        return cont(null, 'next');         
    }).then(function(cont, msg){
        let counter = 0;
        let filenum = 1;
        let inputFile = fs.createReadStream(__dirname + '/' + fileBpath);
        let arr = [];
        readline(inputFile).go(function (data, next) {
            counter++;
            arr.push(data);
            if(counter % 2 === 0) {
                arr.sort();
                let reading = arr.join('');
                fs.writeFileSync(__dirname + '/B/' + filenum, reading);
                filenum++;
                arr = [];
            }
            next();
        }, function () {
            fs.writeFileSync(__dirname + '/B/' + filenum, arr[0]);
        }); 
        return cont(null, 'next');        
    }).then(function(cont, msg){
        let i = 1 , j = 1;
        let Afalg = true , Bfalg = true;
        let arrA = [],  arrB = [];
        let readinga = '', readingb = '';
        while(Afalg){
            Afalg = fs.existsSync(__dirname + '/A/' + i);
            if(Afalg){
                let reada = fs.readFileSync(__dirname + '/A/' + i, 'utf8');
                readinga += reada + '\r';
            }
            i++;
        }
        arrA = readinga.split('\r');
        removeEmptyArrayEle(arrA);
        let resulta = mergetSort(arrA)
        let wresulta = resulta.join('\r');
        fs.writeFileSync(__dirname + '/a' + fileApath, wresulta);
        while(Bfalg){
            Bfalg = fs.existsSync(__dirname + '/B/' + j);
            if(Bfalg){
                let readb = fs.readFileSync(__dirname + '/B/' + j, 'utf8');
                readingb += readb + '\r';
            }
            ++j;
        }
        arrB = readingb.split('\r');
        removeEmptyArrayEle(arrB);
        let resultb = mergetSort(arrB).join('\r');
        fs.writeFileSync(__dirname + '/b' + fileBpath, resultb);
        return cont(null, 'next');
    }).then(function(cont, msg){
        let resultA = fs.readFileSync(__dirname + '/a' + fileApath, 'utf8');
        let resultB = fs.readFileSync(__dirname + '/b' + fileBpath, 'utf8');
        let arrA = resultA.toString().split('\r');
        let arrB = resultB.toString().split('\r');
        let result = mergetdif(arrA, arrB).join('\r');
        fs.writeFileSync(__dirname + '/' + fileCpath, result);
        return callback('success');
    }).fail(function(cont, err){
        return callback(err);
    });
}

differentSet('A.txt', 'B.txt', 'C.txt', function(msg){
    return console.log(msg);
});

module.exports = {  
                    mergetSort,
                    removeEmptyArrayEle,
                    checkfiles,
                    mergetdif,
                    differentSet,
                }