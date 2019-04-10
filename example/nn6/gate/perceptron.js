const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

net.inputLayer([2])
net.push(nn6.PerceptronLayer, {n:1})
net.push(nn6.RegressionLayer)

module.exports = net
