
//每个文件当前读取的位置的缓存，key是文件名称，value是第几行
let pos_buf = {};
// 每个文件的最小数据缓存，key是文件吗，value是这个文件的最小数据
let file_min_data_buf = {};
//文件名称列表
let files =[];
/**
 * 读取文件第几行的数据
 */
async function  readline(file) {
    
}
/**
 * 读取一个对象中的，最小数据对应的文件名
 */
function findMinDataAndFileName(){

}

//验证是否所有的文件已经读取完毕
function check_finished(){

}

(async function(){
    //文件初始化读取
    for(let file of files){
        let min_data = await readline(file);
        pos_buf[file] = 0;
        file_min_data_buf[file] = min_data;
    }

    //读取文件，获取每行的数据
    while(true){
        let finished = check_finished();
        if(finished) break;

        let {filename, min_data} = await findMinDataAndFileName(file_min_data_buf);

        pos_buf[filename] = pos_buf[filename] +1;
        file_min_data_buf[filename] = min_data;
    }
    console.log('处理完毕');
})()



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