const E = require('../../js6/eq6')
let F = E.F

function run(code, binds) {
  let eqs = E.equations(code)
  // console.log('eqs=', eqs)
  // console.log('eqs(%j)=%j', binds, eqs.eval(binds))
  let debug = false
  let r = E.solve({eqs, binds, debug})
  console.log('code=%s r=%j', code, r)
}

run('a+b=3', {a:0,b:0}) // 成功
run('x*x-2*x+1=0', {x:0}) // 成功
run('x*x-a*x+1=0;a=2', {x:0,a:0}) // 成功
run('f=m*a;m=3;f=3', {f:3, m:2, a:1}) // (單一修改時)失敗 ??? (多重修改時) 成功！// 猜測：單一修改時因為 m=3 訂死了，導致 f,a 都調到最好了之後， m 動彈不得，於是就掛了！
run('c=c;f(PI/2)=0;f(0)=0', {c:1.5, f:'(x)=>sin(c*x)'}) // 成功了! 注意要加入 c=c，否則只有 f 會不動！
