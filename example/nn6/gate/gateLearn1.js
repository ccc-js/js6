const net = require('./perceptron')

net.learn([1,1], [1])
console.log(net.toString())
net.learn([0,1], [1])
console.log(net.toString())
