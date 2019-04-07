const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

let iLayer = net.inputLayer([7])
let p1Layer = net.push(nn6.PerceptronLayer, {n:5})
let p2Layer = net.push(nn6.PerceptronLayer, {n:4})
let rLayer = net.push(nn6.RegressionLayer)
net.watch({x:iLayer.o, o:rLayer.x})

module.exports = net
