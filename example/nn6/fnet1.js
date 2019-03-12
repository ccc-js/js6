const cn6 = require('..')
const net = new cn6.Net()

let x = net.variable(2)
// let t = net.sigmoid(x)
let t = net.relu(x, 0)
let o = net.neg(t)

net.watch({x,o})

module.exports = new cn6.FNet(net, {x:x})
