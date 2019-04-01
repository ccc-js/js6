// const nn6 = require('../../nn6')
const net = require('./perceptron')

net.forward()
console.log(net.toString())

net.backward()
console.log(net.toString())
