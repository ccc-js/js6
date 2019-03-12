const nn6 = require('../../nn6')
const ma6 = require('../../ma6')
const net = require('./net4')
// const fnet = require('./fnet1')

let p = new ma6.Point([1, 2])
console.log('forward: f()')
console.log('main: p=', p)
nn6.Net.call(net, p)

console.log(net.dump())

console.log('backward: grad()')

nn6.Net.grad(net, p)

console.log(net.dump())
