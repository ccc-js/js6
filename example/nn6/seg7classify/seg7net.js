const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

let iLayer = net.inputLayer([7])
let fc1Layer = net.push(nn6.FullyConnectLayer, {n:8})
let relu1Layer = net.push(nn6.ReluLayer)
let fc2Layer = net.push(nn6.FullyConnectLayer, {n:10})
let softmaxLayer = net.push(nn6.SoftmaxLayer)

module.exports = net
