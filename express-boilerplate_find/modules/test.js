function mergetSort(arr) {
    if(arr.length === 1) {
        return arr;
    }
    //数组二分
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
// qunit

function test() {
    var arr1 = [28,13,4,19,10];
    var arr2 = [1,5,4,6,4,2];
    console.log(mergetSort(arr1));
    console.log(mergetSort(arr2));
}
test();