const nu6 = require('..')
const V = nu6.V

let a = [2,4,6]
let b = [1,2,3]
let c = 2
console.log('a=', a, 'b=', b)
console.log('neg(a)=',   V.neg(a))
// console.log('rot(a)=',   a.rot())
console.log('add(a,b)=', V.add(a,b))
console.log('sub(a,b)=', V.sub(a,b))
console.log('mul(a,b)=', V.mul(a,b))
console.log('div(a,b)=', V.div(a,b))
console.log('mod(a,b)=', V.mod(a,b))
console.log('powc(a,c)=',V.powc(a,c))
console.log('mulc(a,c)=',V.mulc(a,c))
console.log('dot(a,b)=', V.dot(a,b))
console.log('sum(a)=',   V.sum(a))
console.log('mean(a)=',  V.mean(a))
console.log('sd(a)=',    V.sd(a))
