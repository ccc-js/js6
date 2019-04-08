const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

net.inputLayer([1])
net.push(nn6.FcActLayer, {n:5, ActLayer:nn6.ReluLayer})
net.push(nn6.FcActLayer, {n:1, ActLayer:nn6.ReluLayer})
net.push(nn6.RegressionLayer)

net.optimize({
  inputs: [[0.1], [0.2], [0.3]],
  outs: [[0.5], [0.5], [0.5]],
  minLoops: 2000,
  maxLoops: 10000,
  gap: 0.0000001
})
