const nn6 = require('../../../js6/nn6')
const net = require('./net4')

let p = net

nn6.Net.call(net, p)

console.log(net.toString())

nn6.Net.grad(net, p)

console.log(net.toString())
