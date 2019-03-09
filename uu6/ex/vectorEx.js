const uu6 = require('..')
const {V} = uu6
let a = [2,4,6], b = [1,2,3]

console.log('a=', a, 'b=', b)
console.log('add(a,b)=', V.add(a,b))
console.log('sub(a,b)=', V.sub(a,b))
console.log('mul(a,b)=', V.mul(a,b))
console.log('div(a,b)=', V.div(a,b))
console.log('mod(a,b)=', V.mod(a,b))
console.log('dot(a,b)=', V.dot(a,b))
console.log('cmul(a,3)=', V.cmul(3, a))

