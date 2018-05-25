const fs = require('fs');
const readline = require('lei-stream').readLine;
const lineread =require('readline');
const Thenjs = require('thenjs');
const md5 = require('crypto').createHash('md5');

function read(url) {
    fs.readdir(url, function (err, files) {
        files.forEach(function (file) {
            var filePath = url + "/" + file;
            fs.stat(filePath, function (err, stats) {
                if (stats.isDirectory()) {
                    read(filePath);
                } else {
                    var rl = lineread.createInterface({
                        input: fs.createReadStream(filePath),
                        terminal: false
                    });
                    var fileType = file.split('_');
                    var jsonss = [];
                    rl.on('line', function (line) {
                        if (line != null && line != "") {
                            jsonss.push(JSON.parse(line));
                        }
                    }).on('close', function () {
                        var jsondata = { filename: file, data: jsonss };
                        if (fileType[fileType.length - 1] == 'dup') {
                            mongodao.qcdupModel.create(jsondata, function (err, res) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    count++;
                                    console.log('save qcdupmodel ok' + count);
                                    console.info(res);
                                }
                            });
                        } else if (fileType[fileType.length - 1] == 'nodup') {
                            mongodao.qcnodupModel.create(jsondata, function (err, res) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    count++;
                                    console.log('save qcnodumpmodel ok' + count);
                                    console.info(res);
                                }
                            });
                        } else {
                            mongodao.qcModel.create(jsondata, function (err, res) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    count++;
                                    console.log('save qcmodel ok' + count);
                                    console.info(res);
                                }
                            });
                        }
                    });
                    console.info("===================================")
                }
            })
        })
    });
}

function mergetSort(arr) {
    if(arr.length === 1) {
        return arr;
    }
    var leftArr = arr.slice(0, Math.floor(arr.length / 2));
    var rightArr = arr.slice(leftArr.length);
    // 递归
    return merge(mergetSort(leftArr), mergetSort(rightArr)); 
    // 合并有序序列
    function merge(arrLeft, arrRight) {
        var indexLeft = 0,
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

function merge(arrLeft, arrRight) {
    var indexLeft = 0,
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

var baseUrl = 'D:/下载/line';
var createJson = 'D:/下载/line/data.txt';
function aa(){
    fs.readdir(baseUrl, function(err, files) {
        if (err) {
            throw err;
        }
        var filePath = '';

        var fileReadStream;
        var fileWriteStream = fs.createWriteStream(createJson);


        createStramFile();
        var fileNum = files.length-1;

        function createStramFile(){
            var currentfile = baseUrl+'/' + files.shift();
            fileReadStream = fs.createReadStream(currentfile);
            fileReadStream.pipe(fileWriteStream,{end:false});
            fileReadStream.on("end", function() {
                console.log(currentfile + ' appended');
                createStramFile();
            });
            if (!files.length) {
                fileWriteStream.end("Done");
                console.log('copy Done');
                return;
            }

            fileWriteStream.on('data',function(chunk){
                console.log('copy data');
                return chunk+','
            });

            fileWriteStream.on('close',function(){
                console.log(fileNum);
                if (!fileNum) {
                    roMockJs()
                }
                --fileNum;
                console.log('copy over');
                //roMockJs();
            });

        }


    });
}

async function getOrderBigfile(filename, filenum){
    let fd = [];
    let arr = [];
    for(let i = 0; i < filenum; i++){
        fd.push(fs.openSync('D:/下载/line/' + filename + '/' + i + '.txt', 'r+'));
    }
    let result = await fs.read(fd[i], buff, offset, 16, )
    
}

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
        getOrderBigfile(fileA, filenumA);
        
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
read('D:/下载/line');