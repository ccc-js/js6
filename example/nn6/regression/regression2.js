const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

net.inputLayer([1])
net.push(nn6.FcActLayer, {n:20, ActLayer:nn6.ReluLayer})
net.push(nn6.FcActLayer, {n:20, ActLayer:nn6.ReluLayer})
net.push(nn6.FcActLayer, {n:1, ActLayer:nn6.ReluLayer})
net.push(nn6.RegressionLayer)

// 預測 x*sin(x) 曲線 (擬合問題)
function genData (N) {
  var data = []
  var labels = []
  for (var i = 0; i < N; i++) {
    var x = Math.random() * 10 - 5
    var y = x * Math.sin(x)
    data.push([x])
    labels.push([y])
  }
  return {data: data, labels: labels}
}

let d = genData(20)

net.optimize({
  inputs: d.data,
  outs: d.labels,
  minLoops: 2000,
  maxLoops: 100000,
  // gap: 0.00001
})
