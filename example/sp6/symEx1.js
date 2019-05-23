const S = require('../../js6/sp6').symbol

console.log('=================== eval =================')
let context = {x:3}
let exp = 'sin(x)'

console.log('call(%s, %j)=%d', exp, context, S.call(exp, context))
let dexp = S.diff(exp, 'x')
console.log('call(%s, %j)=%d', dexp, context, S.call(dexp, context))

console.log('=================== sin(x) =================')
console.log('exp=', exp)
for (let i=1; i<10; i++) {
  exp = S.diff(exp, 'x')
  console.log('D%d(exp)=%j', i, exp)
}

console.log('=================== D(exps) =================')
let exps = ['cos(x)', '3*8', 'x*3', 'x/y', '3*x+2*y', 'sin(x)', 'cos(x)', 'cos(3*x)', 'y*cos(3*x)', 'exp(x)', '-3*x', '-x*y', 'pow(x,2)', '-x*y+x*y']
for (let exp of exps) {
  let dexp = S.diff(exp, 'x')
  console.log('D(exp)=%j', dexp)
}