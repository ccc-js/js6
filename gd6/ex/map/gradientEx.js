const pf = require('../pf')
const ds6 = require('../../../ds6')
const p = new ds6.MapVector({x:1, y:2})

console.log('call(p, x) = ', pf.call(p, 'x'))
console.log('df(p, x) = ', pf.df(p, 'x'))
console.log('grad(p)=', pf.grad(p))
