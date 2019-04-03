const net = require('./seg7net')
const seg7io = require('./seg7io')

console.log(net.toString())
net.learn(seg7io.inputs[0], seg7io.outs[0])
console.log(net.toString())

