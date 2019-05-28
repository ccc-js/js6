const ma6 = require('../../js6/ma6')
const Vector = ma6.Vector

let a = new Vector([2,4,6])
let b = new Vector([1,2,3])
let c = 2
console.log('a=', a, 'b=', b)
console.log('neg(a)=',   a.neg())
console.log('add(a,b)=', a.add(b))
console.log('sub(a,b)=', a.sub(b))
console.log('mul(a,b)=', a.mul(b))
console.log('div(a,b)=', a.div(b))
console.log('mod(a,b)=', a.mod(b))
/*
console.log('powc(a,c)=',a.powc(c))
console.log('mulc(a,c)=',a.mulc(c))
*/
console.log('dot(a,b)=', a.dot(b))
console.log('sum(a)=',   a.sum())
console.log('mean(a)=',  a.mean())
console.log('sd(a)=',    a.sd())

console.log('a.mul(b).add(b).add(a)=', a.mul(b).add(b).add(a))
