const nj6 = require('..')

let a = nj6.array([2,4,6])
let b = nj6.array([1,2,3])

console.log('a=', a.str(), 'b=', b.str())
console.log('neg(a)=',   a.neg().str())
// console.log('rot(a)=',   a.rot().str())
console.log('add(a,b)=', a.add(b).str())
console.log('sub(a,b)=', a.sub(b).str())
console.log('mul(a,b)=', a.mul(b).str())
console.log('div(a,b)=', a.div(b).str())
// console.log('pow(a,b)=', a.power(b).str())
console.log('dot(a,b)=', a.dot(b).str())
console.log('eq(a,a)=', a.eq(a))
console.log('eq(a,b)=', a.eq(b))
console.log('eq(a,hello)=', a.eq('hello'))
/*
console.log('mod(a,b)=', V.mod(a,b).str())
console.log('dot(a,b)=', V.dot(a,b).str())
console.log('cmul(a,3)=', V.cmul(3, a).str())
*/