const pf = require('./pf')
const ds6 = require('../../ds6')
const p = new ds6.Vector([1,2])

console.log('p=', p.json())
console.log('call(p) = ', pf.call(p))
console.log('grad(p)=', pf.grad(p).toString())
