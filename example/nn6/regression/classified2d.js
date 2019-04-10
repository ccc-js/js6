const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

net.inputLayer([2])
net.push(nn6.FcActLayer, {n:6, ActLayer:nn6.TanhLayer})
net.push(nn6.FcActLayer, {n:2, ActLayer:nn6.TanhLayer})
net.push(nn6.SoftmaxLayer)

// 二維平面的點分類 (擬合問題)
function originalData () {
    var data = []
    var labels = []
    data.push([-0.4326, 1.1909]); labels.push(1)
    data.push([3.0, 4.0]); labels.push(1)
    data.push([0.1253, -0.0376]); labels.push(1)
    data.push([0.2877, 0.3273]); labels.push(1)
    data.push([-1.1465, 0.1746]); labels.push(1)
    data.push([1.8133, 1.0139]); labels.push(0)
    data.push([2.7258, 1.0668]); labels.push(0)
    data.push([1.4117, 0.5593]); labels.push(0)
    data.push([4.1832, 0.3044]); labels.push(0)
    data.push([1.8636, 0.1677]); labels.push(0)
    data.push([0.5, 3.2]); labels.push(1)
    data.push([0.8, 3.2]); labels.push(1)
    data.push([1.0, -2.2]); labels.push(1)
    return {data: data, labels: labels} // , N: N
}

let d = originalData()

net.optimize({
  inputs: d.data,
  outs: d.labels,
  minLoops: 2000,
  maxLoops: 100000,
  gap: 0.00001
})
