const S = require('../../js6/sp6').symbol

let exps = ['3*8', 'x*3', 'x/y', '3*x+2*y', 'sin(x)', 'cos(x)', 'cos(3*x)', 'y*cos(3*x)', 'exp(x)', '-3*x', '-x*y', 'pow(x,2)']
for (let exp of exps) {
  let dexp = S.diff(exp, 'x')
  console.log('D(exp)=%j', dexp)
}

console.log('=================== sin(x) =================')
let exp = 'sin(x)'
console.log('exp=', exp)
for (let i=1; i<10; i++) {
  exp = S.diff(exp, 'x')
  console.log('D%d(exp)=%j', i, exp)
}

console.log('=================== eval =================')
let context = {x:3}
exp = 'sin(x)'

console.log('call(%s, %j)=%d', exp, context, S.call(exp, context))
let dexp = S.diff(exp, 'x')
console.log('call(%s, %j)=%d', dexp, context, S.call(dexp, context))
