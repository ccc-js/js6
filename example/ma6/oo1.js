const {OO} = require('../../js6/ma6')
const {oo} = OO
console.log('==================vector============')
let a = oo([2,4,3])
let b = oo([1,2,3])
let c = oo(2)
console.log('a=', a, '\nb=', b, '\nc=', c)
console.log('add(a,b)=%s', a.add(b))
console.log('add(a,c)=%s', a.add(c))
console.log('add(c,b)=%s', c.add(b))
console.log('add(c,c)=%j', c.add(c))

console.log('==================ratio============')
a = oo('3/5'), b = oo('5/3')
console.log('a=', a, 'b=', b)
console.log('add(a,b)=', a.add(b))
console.log('mul(a,b)=', a.mul(b))
