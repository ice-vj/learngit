const fs = require('fs');
const readline = require('lei-stream').readLine;
const lineread =require('readline');
const Thenjs = require('thenjs');
const md5 = require('crypto').createHash('md5');

let index_map = {};
let data_map = {};
let tempfils = [];

//获取排好序文件
function getOrderBigFile(){
    
}

//获取文件列表
let files = fs.readdirSync('D:/下载/line')
//写入文件流

//读取文件下一行内容
function readNextLine(file, callback){
    fs.read()
};
//获取值最小值的文件名
function getMinDataFile(data_map, index_map){
    for(data in data_map){
        
    }
};
//检测文件是否读完
function checkFinish(){

};


function initAllMinData(callback){
    //如果文件列表为空
    if(!tempfils.length){
        //返回所有文件首行数据
        return callback(null, data_map);
    }
    //定义file为临时文件去除首行数组
    let file = tempfils.shift();
    readNextLine(file, function(err, lineData){
        if(err){
            return callback(err);
        }
        //把新一行数据放入数据对象
        data_map[file] = lineData;
        index_map[file] =  0;
        initAllMinData(callback);
    });
    
}
//文件分类
function file_sort(callback){
    //获取最小文件的文件名
    let finished = checkFinish();
    if(finished){
        return callback(null, 'finished');
    }
    let minFile = getMinDataFile(data_map, index_map);
    //获取此时最小文件首行内容
    //写入流

    //读取最小文件的下一行
    readNextLine(minFile, function(lineData){
        //err catch
        //数据对象内容更新
        data_map[file] = lineData;
        //标记文件读取行数
        index_map[file] = index_map[minFile]+1;
        file_sort(callback);
    })
};

initAllMinData(function(err, data_map, callback){
    if(err){
        console.log(err);
        process.exit();
    }
    
    file_sort(callback);
});



//md5签名
function tomd5(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}

//将大文件拆分成有序小文件
function getManyOrderFiles(file, callback){
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
            callback(i+1);
        }
    })
}

function getdiff(fileA, fileB, callback){
    //console.log(fileA);
    Thenjs(function(cont){
        getManyOrderFiles(fileA, function(filenumA){
            cont(null, filenumA);
        });
    }).then(function(cont, filenumA){
        getManyOrderFiles(fileB, function(filenumB){
            cont(null, filenumB);
        });
    }).then(function(cont, filenumA, filenumB){
        
        
    }).fail(function(cont, err){
        return callback(err);
    })
}

// getdiff('A', 'B', function(msg){
//     console.log(msg);
// });
//read('D:\下载\line');
//chaifen();
// md5.update('ljdaksljdlaj');
// let s = md5.digest('hex');
// console.log(s);
//read('D:/下载/line');