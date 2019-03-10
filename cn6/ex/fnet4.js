const cn6 = require('..')
const net = new cn6.Net()

let x = net.variable(2)
let y = net.variable(1)
let x_1 = net.sub(x, net.constant(3))
let x2 = net.mul(x_1, x_1)
let y2 = net.mul(y, y)
let o  = net.add(x2, y2)

net.watch({x,y,x2,y2,o})

module.exports = new cn6.FNet(net, {x:x, y:y})