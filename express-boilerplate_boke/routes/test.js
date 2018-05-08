
// //类型
// var a = 123;
// var b = {a};
// console.log(a);
// console.log(typeof a);
// console.log(b);
// console.log(typeof b);
// console.log('==========');


// //对象加属性
// var o ={
//     x:2
// };
// o.x=1;
// o.y=3;
// console.log(o.x);
// console.log(typeof o.x);
// console.log('==========');

// //数组
// var a = [];
// a[0] = 2;
// a[4] = 1;
// console.log(a);
// console.log('==========');

// //
// var n = 2-"a";
// var m =  n + "ss"

// console.log(n +"  " +typeof n);
// console.log(m+ "  " + typeof m);
// console.log('==========');

// var a = Object("ad");
// console.log(a+"======"+typeof a);
// console.log('==========');


// for(var i = 0, j = 10; i < 10; i++, j--){
//     console.log(i*j);
// }
// console.log('===========');

// for(var p in o) console.log(p);
// console.log('===========');


// // 变量的作用域
// var scope = 'global scope';
// function checkscope(){
//     var scope = 'local scope';
//     function nested(){
//         var scope = 'nested scope';
//         console.log(scope);
//     }
//     return nested();
// }
// checkscope();


// var a = '2'; b = 2;
// console.log(a <= b);

// var data = [3, 4, 5];
// var a = '2' in data;
// var b = 1 in data;
// var c = 4 in data;
// console.log(a + '' + b + '' + c);


//通过原型继承创建对象
// function inherit(p){
//     if(p == null) throw TypeError();
//     if(Object.create)
//         // console.log(p+'fun');
//         return Object.create(p);
//     var t = typeof p;
//     if(t !== 'object' && t !== 'function') throw TypeError();
//     function f() {};
//     f.prototype = p;
//     return new f();
// }


// //对象属性继承

// var o = {}
// o.x = 1;
// console.log(o);
// var p = inherit(o);
// console.log(p.x);
// p.y = 2;
// console.log(p);
// var q = inherit(p);
// q.z = 3;
// var s = q.toString();
// console.log( q.x + q.y);

//属性检测

// var o = { x:1 }
// var x = 'x' in o ;
// var y = 'y' in o ;
// var z = 'toString' in o;
// console.log(x + '--' + y + '--' + z);

//数组

// var empty = [];                  //空数组
// var primes = [2, 3, 5, 7, 11];   //5个值数组
// var misc = [1.1, true, "aa", ,];  //不同类型的数组(最后一个值为undefined)

// // console.log(primes.length + ' ' + misc.length);
// var slices = primes.slice(-4,-1);
// console.log(slices);

// var date = new Date();
// console.log(date);

//阶乘
// function factorial(x) {
//     if (x <= 1) return 1;
//     return x * factorial(x-1);
// }

// let a =  factorial(5);
// console.log(a);

//勾a股b弦c
  //  function hyp(a,b){
  //    function squ(x) {return x*x;}
  //    return Math.sqrt(squ(a)+squ(b));
  //  }
  //  let c = hyp (3,4);
  //  console.log(c);

//定义返回参数
// function constfunc(v) { return function() { return v; }; }
// var funcs = [];
// for(var i = 0; i < 10; i++){
//     funcs[i] = constfunc(i);
// }
// var result = funcs[8]();
// console.log(result);


//THENJS
const Thenjs = require('thenjs');

function task(org, callback){
 db.collection.findOne(query, function(){
      callback(null,org);
  });
}

Thenjs(function(cont){
  task(10, cont);
})
.then(function(cont, arg){
  console.log(arg);
  cont(new Error('error!'), 123);
})
.fin(function(cont, error, result){
  console.log('error1', result);
  cont();
})
.each([0, 1, 2], function(cont, value){
  task(value * 2, cont);
})
.then(function(cont, result){
  console.log(result);
  cont();
})
.series([
  function(cont){task(88, cont);},
  function(cont){cont(null, 99);}
])
.then(function(cont, result){
  console.log(result);
  cont(new Error('error!'));
})
.fail(function(cont, error){
  console.log('error2');
  console.log('DEMO END');
})

//

Thenjs.each(ques_ids_grp, function(cont, ids) {
  // 查询条件
  var cond = {
      '_id': {'$in': ids}
  };
  // 提取出的字段
  var proj = {
      '_id': 1,
      'knowledges': 1,
      'videos': 1,
  };
  if ('all' == fields_type) {
      proj.answer = 1;
      proj.image_url = 1;
  }
  // 查询
  var coll = db.collection('mark_question');
  coll.find(cond).project(proj).toArray(function(err, items) {
      if (err) {
          return cont(err);
      }
      return cont(null, items);
  });
}).then(function(cont, result) {
  var order_d = {};
  for (var i in ques_ids){
      order_d[ques_ids[i]] = i;
  }
  var questions = [];
  for (var k in result) {
      var items = result[k];
      // 将查询到的数组转为Map, key:id, value:q_info
      for (var i in items) {
          var item = items[i];
          item['id'] = item['_id']
          // 试题图片, 试题答案
          if (item.answer) {
              item.data_urls = common.norm_ques_image(item.image_url);
              item.answer = common.norm_ques_answer(item.answer);
          }
          delete item['_id']
          delete item['image_url']
          questions.push(item);
      }
  }
  questions.sort((x, y) => order_d[x.id] - order_d[y.id]);
  return responseWrapper.succ(questions);
}).fail(function(cont, error) {
  Logger.error(error);
  return responseWrapper.error('HANDLE_ERROR');
}).finally(function(cont, error) {
  Logger.error(error);
  return responseWrapper.error('HANDLE_ERROR');
});