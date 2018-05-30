const fs = require('fs');
const readline = require('lei-stream').readLine;
const lineread =require('readline');
const Thenjs = require('thenjs');
const md5 = require('crypto').createHash('md5');
const _ = require('lodash');

let index_map = {};
let data_map = {};
let tempfils = [];
let emptybuffer = new Buffer(33).toString(); 


//获取排好序文件
function getTempfils(filename){
    let files = fs.readdirSync('D:/下载/line/' + filename);
    files.forEach(function(item, index){
        let stat = fs.lstatSync('D:/下载/line/' + filename + '/' + item)
        if (stat.isFile() === true) { 
            tempfils.push(item)
        }
    });
    return true;

}


//读取文件某一行内容
function readNextLine(file, madir, callback){
    let fd = fs.openSync('D:/下载/line/' + madir + '/' + file, 'r+');
    buff = new Buffer(33);
    if(!index_map[file]){
        index_map[file] == 0;
    }
    fs.read(fd, buff, 0, 33, index_map[file], function(err, bytesread, buff){
        let lineStr = buff.toString();
        if(lineStr === emptybuffer){
            delete data_map[file];
            return callback(null, fd, null);
        }else if(lineStr.substring(32) !== '\r'){
            lineStr = lineStr.substring(0, 32) + '\r';
            delete data_map[file];
            return callback(null, fd, lineStr);
        }else{
            return callback(null, fd, lineStr);
        }
    });
};
// readNextLine('0.txt', 'A', function(data){
//     console.log(data);
// })

//获取对象第一个属性
function getFirstAttr(obj){
    for(let attr in obj) return attr;
}

//获取值最小值的文件名
function getMinDataFile(data_map, index_map){
    let minfile = getFirstAttr(data_map);
    for(let file in data_map){
        if(data_map[file] < data_map[minfile])
        minfile = file;
    }
    return minfile;
};
//检测文件是否读完
function checkFinish(){
　　for (var key in data_map){
　　　　return false;//返回false，不为空对象
　　}　　
　　return true;//返回true，为空对象
};


function initAllMinData(madir, callback){
    //如果文件列表为空
    if(!tempfils.length){
        //返回所有文件首行数据
        return callback(null, data_map);
    }
    //定义file为临时文件去除首行数组

    let file = tempfils[0];
    tempfils.shift();
    readNextLine(file, madir, function(err, fd, lineData){
        if(err){
            return callback(err);
        }

        //把新一行数据放入数据对象
        data_map[file] = lineData;
        index_map[file] =  0;
        fs.close(fd, function(err){
            if(err){
                return callback(err);
            }
        });
        initAllMinData(madir, callback);
    });
    
}
//文件分类
function file_sort(madir, callback){
    //获取最小文件的文件名
    let finished = checkFinish();
    if(finished){
        return callback('finished');
    }
    let minFile = getMinDataFile(data_map, index_map);
    if(!_.isNil(data_map[minFile])){
        //写入流
        fs.appendFileSync('D:/下载/line/' + madir +'order.txt', data_map[minFile]);
    }else{
        return;
    }
    //读取最小文件的下一行
    index_map[minFile] = index_map[minFile]+33;
    
     readNextLine(minFile, madir, function(err, fd, lineData){
         //err catch
         //数据对象内容更新
         if(lineData){
            data_map[minFile] = lineData;       
         }
        fs.close(fd, function(err){
            if(err){
                return callback(err);
            }
        });
    
        file_sort(madir, callback)
    })
};


//md5签名
function tomd5(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}

//将大文件拆分成有序小文件
function getManyOrderFiles(file){
    let i = 0;
    let count = 1;
    let readtxt = [];
    let a = readline('D:/下载/line/' + file + '.txt', {
        newline: '\n',
        autoNext: false,
    });

    a.on('data', function(data){       
        let str = tomd5(data);
        readtxt.push(str);
        if(count % 10 == 0){
            let a = readtxt.sort();
            //console.log(a);
            let writes = a.join('\r');
            fs.writeFileSync('D:/下载/line/' + file + '/' + i + '.txt', writes);
            i++;
            readtxt = [];
        }
        count++;
        a.next();
    })
    a.on('end', function(){
        if(readtxt){
            let a = readtxt.sort();
            let writes = a.join('\r');
            fs.writeFileSync('D:/下载/line/' + file + '/' + i + '.txt', writes);
        }
    })
}

function getBigOrderFile(file, callback){
    getTempfils(file);
    initAllMinData(file, function(err, data_map, cb){
        if(err){
            return cont(err);
        }  
        file_sort(file, function(msg){
            return callback(msg)
        });
    });
}

function getdiff(fileA, fileB, callback){
    //console.log(fileA);
    Thenjs(function(cont){
        try{
            getManyOrderFiles(fileA);
            getManyOrderFiles(fileB);
        }catch(err){
            return cont(err);
        }
        return cont(null, 'success')
    }).then(function(cont, msg){
        getTempfils(fileA);
        initAllMinData(fileA, function(err, data_map, cb){
            if(err){
                return cont(err);
            }  
            file_sort(fileA, cb);
        });
        return cont(null, msg)
    }).then(function(cont, msg){
        getTempfils(fileB);
        initAllMinData(fileB, function(err, data_map, cb){
            if(err){
                return cont(err);
            }  
            file_sort(fileB, cb);
        });
        return cont(null, msg);
    }).then(function(cont, msg){
        return callback(msg)
    }).fail(function(cont, err){
        return callback(err);
    })
}

function getdiffent(fileA, fileB, callback){
    getManyOrderFiles(fileA);
    getManyOrderFiles(fileB);
    Thenjs(function(cont){
        getBigOrderFile(fileA, function(msgA){
            cont(null, msgA);
        });
    }).then(function(cont, msgA){
        index_map = {};
        data_map = {};
        tempfils = [];
     
        getBigOrderFile(fileB, function(msgB){
            cont(null, msgB);
        });
        
    }).fail(function(cont, err){
        callback(err);
    });
    

}


// getdiff('A', 'B', function(msg){
//     console.log(msg);
// });
getdiffent('A', 'B');
//read('D:\下载\line');
//chaifen();
// md5.update('ljdaksljdlaj');
// let s = md5.digest('hex');
// console.log(s);
//read('D:/下载/line');