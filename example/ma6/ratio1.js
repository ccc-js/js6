const ma6 = require('../../js6/ma6')
let a = new ma6.Ratio('3/2')
let b = new ma6.Ratio('2/3')

console.log('a=%s b=%s',  a, b)
console.log('a.neg()=%s', a.neg())
console.log('a.inv()=%s', a.inv())
console.log('add(a,b)=%s', a.add(b))
console.log('sub(a,b)=%s', a.sub(b))
console.log('mul(a,b)=%s', a.mul(b).reduce())
console.log('div(a,b)=%s', a.div(b))

console.log('a.mul(b).add(b).add(a).reduce()=%s', a.mul(b).add(b).add(a).reduce())
