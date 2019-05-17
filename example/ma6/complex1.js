const ma6 = require('../../js6/ma6')
let a = ma6.complex('1+2i')
let b = ma6.complex('2+1i')

console.log('a.conj()=',  a.conj())
console.log('a.neg()=',   a.neg())
console.log('a.toPolar()=', a.toPolar())
console.log('a.pow(3)=', a.pow(3))
console.log('a.sqrt()=', a.sqrt())
console.log('add(a,b)=', a.add(b))
console.log('sub(a,b)=', a.sub(b))
console.log('mul(a,b)=', a.mul(b))
console.log('div(a,b)=', a.div(b))


console.log('a.mul(b).add(b).add(a)=', a.mul(b).add(b).add(a))

let c = ma6.complexArray('1+2i,2+1i,3+3i')
let d = ma6.complexArray('2+1i,1+2i,0+0i')

console.log('c=', c)
console.log('d=', d)

console.log('c.r+d.r=', ma6.V.add(c.r, d.r))
console.log('c.i-d.i=', ma6.V.sub(c.i, d.i))

