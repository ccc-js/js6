const nn6 = require('../../../nn6')
const net = new nn6.Net()

let x = net.input([2])
// console.log('x=', x)
let p = net.push(nn6.PerceptronLayer, {n:1})
net.watch({x, o:p.o})

/// net.watch({x, w:p.w, o:p.o})

module.exports = net
