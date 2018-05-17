const express = require('express');

const Thenjs = require('thenjs');
const fs = require('fs');

//读取文件内容，得到每行的字符串组成的数组
function readLines(input, callback){
    let remaining = '';
    let arr = [];
    input.on('data', function(data){
        remaining += data;
        arr = remaining.split('\n');
        console.log(arr);
        return callback(arr);
    }); 
}
// var arr1 = ["a", "b", "c", "d", "d"];
// var arr2 = ["c", "e", "f"];
//得到差集字符串
function getDiffStr(arr1, arr2){
    let arrlen = arr1.length;
    if(arr1.length < arr2.length){
        arrlen = arr2.length;
    }
    for (var i = 0; i < arrlen; i++) {
        for(var j = 0; j < arrlen; j++){
            var sReg = new RegExp("^" + arr2[j] + "$");
            arr1[i] = arr1[i].replace(sReg, "");
        }
    }
    return arr1.join('');
}

// let a = getdifarr(arr1, arr2);
// let b = a.split('');
// console.log(a);
// console.log(b);
// dirs = ["a", "b", "d"]

//将字符串放入本地文件
function pushfile(filepath, content, callback){
    Thenjs(function(cont){
        fs.open(__dirname + filepath,'r+' ,function(err, fd){
            if(err){
                return cont(err);
            }
            return cont(null,fd);
        });
    }).then(function(cont ,fd){
        //追加
        //fs.appendFile(__dirname + filepath, content, function(err){
        //重新写 
        fs.writeFile(__dirname + filepath, content, function(err){
            if(err){
                return cont(err);
            }
            return callback(true);
        });
    }).fail(function(cont, err){
        return callback(false);
    });
}

////查询文档是否存在
function checkfiles(file){
    var sReg = new RegExp("([^\/]+\.+$)");
    if(!sReg.exec(file) || file === '/' || file === ''){
        //return console.log('pathERR');
        return 'pathERR';
    }else{
        flag = fs.existsSync(__dirname + file);
        //console.log(flag);
        return flag;
    }
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
    var inputA = fs.createReadStream(__dirname + fileApath);
    var inputB = fs.createReadStream(__dirname + fileBpath);
    Thenjs(function(cont){
        readLines(inputA, function(data1){
            return cont(null, data1);
        });
    }).then(function(cont, data1){
        readLines(inputB, function(data2){
            return cont(null, data1, data2);
        });
    }).then(function(cont, data1, data2){
        let arrlen = data1.length;
        if(data1.length > data2.length){
            arrlen = data2.length;
        }
        for(var i = 0; i < arrlen; i++){
            let datastr = getDiffStr(data1[i].split(''), data2[i].split(''));
            data1[i] = datastr;
        }
        let result = data1.join('\n');
        return cont(null, result);
    }).then(function(cont, result){
        pushfile(fileCpath, result, function(flag){
            if(flag){
                return callback('success');
                //return console.log('success');
            }else{
                return cont(err);
            }
        });
    }).fail(function(cont,err){
        //return console.log(err);
        return callback('err');
    });
}

differentSet('/A.txt', '/B.txt', '/dd.txt', function(msg){
    console.log(msg);
});

module.exports = differentSet;