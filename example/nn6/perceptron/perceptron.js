const nn6 = require('../../../nn6')
const net = new nn6.Net()

let x  = net.variables(3)
let w  = net.variables(3)
let xw = net.tmul(x,w)
let s  = net.tsum(xw)
let o  = net.tsigmoid(s)

net.watch({x,w,o})

module.exports = net
