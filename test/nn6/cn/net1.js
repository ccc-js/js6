const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

let x  = net.variable(2)
let y  = net.variable(1)
let x_3= net.sub(x, net.constant(3))
let x2 = net.mul(x_3, x_3)
let y2 = net.mul(y, y)
let o  = net.add(x2, y2)

net.watch({x,y,o})

module.exports = net
