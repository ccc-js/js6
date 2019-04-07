const cn6 = require('..')
const net = new cn6.Net()

let x = net.variable(2)
let c3 = net.variable(3)
let o = net.mul(x, c3)

net.watch({x,o})

module.exports = new cn6.FNet(net, {x:x})
