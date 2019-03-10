const gd6 = require('../../gd6')
const fnet = require('./fnet4')
// const fnet = require('./fnet1')

let p = new gd6.Point({x:1, y:2})
console.log('forward: f()')

fnet.call(p)

console.log(fnet.dump())

console.log('backward: grad()')

fnet.grad(p)

console.log(fnet.dump())