const {OO, RA} = require('../../js6/ma6')
const {oo} = OO

console.log('==================vector============')
let a = oo([2,4,3])
let b = oo([1,2,3])
let c = oo(2)
console.log('a=', a, '\nb=', b, '\nc=', c)
console.log('add(a,b)=%s', a.add(b))
console.log('add(a,c)=%s', a.add(c))
console.log('add(c,b)=%s', c.add(b))
console.log('add(c,c)=%s', c.add(c))

console.log('==================ratio============')
a = oo('3/5'), b=oo('5/3')
console.log('a=', a, 'b=', b)
console.log('add(a,b)=%s', a.add(b))
console.log('mul(a,b)=%s', a.mul(b))

console.log('==================complex============')
a = oo('1+2i'), b=oo('2-1i')
console.log('a=', a, 'b=', b)
console.log('add(a,b)=%s', a.add(b))
console.log('mul(a,b)=%s', a.mul(b))

console.log('==================tensor============')
a = oo({r:[1,2,3,4], shape:[2,2]}), b=oo({r:[1,1,1,1], shape:[2,2]})
console.log('a=', a, 'b=', b)
console.log('add(a,b)=%s', a.add(b))
console.log('sub(a,b)=%s', a.sub(b))
console.log('mul(a,b)=%s', a.mul(b))
console.log('div(a,b)=%s', a.div(b))
console.log('mod(a,b)=%s', a.mod(b))
console.log('pow(a,b)=%s', a.pow(b))
console.log('eq(a,b)=%s',  a.eq(b))
console.log('neq(a,b)=%s', a.neq(b))
console.log('lt(a,b)=%s',  a.lt(b))
console.log('gt(a,b)=%s',  a.gt(b))
console.log('leq(a,b)=%s', a.leq(b))
console.log('geq(a,b)=%s', a.geq(b))

console.log('==================bool tensor============')
a = oo({r:[true, false, false, true], shape:[2,2]}), b=oo({r:[true, true, true, false], shape:[2,2]})
console.log('a=', a, 'b=', b)
console.log('and(a,b)=%s', a.and(b))
console.log('or(a,b)=%s',  a.or(b))
console.log('xor(a,b)=%s', a.xor(b))
