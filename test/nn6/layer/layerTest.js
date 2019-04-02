const expect = require('../../../se6').expect
const uu6 = require('../../../uu6')
const nn6 = require('../../../nn6')
const ma6 = require('../../../ma6')
const V = ma6.V
const L = nn6.L

let x = new nn6.tensorVariable([2, -3])
console.log('x=', x.toString())

function check(layer, vo, gx) {
  let o = layer.forward()
  expect(o.v).to.near(vo)
  V.assign(o.g, 1)
  layer.backward()
  console.log(layer.toString())
  expect(x.g).to.near(gx)
}

describe('nn6.Layer', function() {
  describe('nn6.FLayer', function() {
    it('Relu Layer', function() {
      check(new L.ReluLayer(x, 0.0), [2, 0], [1, 0])
    })
    it('Relu Layer', function() {
      check(new L.ReluLayer(x, 0.1), [2, -0.3], [1, 0.1])
    })
    it('Sigmoid Layer', function() {
      check(new L.SigmoidLayer(x), [0.8808,0.0474], [0.105,0.0452])
    })
    it('Tanh Layer', function() {
      check(new L.TanhLayer(x), [0.964, -0.9951], [0.0707, 0.0099])
    })
  })
  describe('nn6.InputLayer', function() {
    it('InputLayer(x)', function() {
      let layer = new L.InputLayer([2])
      layer.setInput(x.v)
      check(layer, x.v, x.g)
    })
  })
  describe('nn6.RegressionLayer', function() {
    it('RegressionLayer([2,-3], [3, 0]', function() {
      let y = [3, 0], gx=[-1, -3], vo = [5]
      let layer = new L.RegressionLayer(x)
      layer.setOutput(y)
      let o = layer.forward()
      expect(o.v).to.near(vo)
      layer.backward()
      expect(x.g).to.near(gx)
      console.log(layer.toString())
    })
  })
  // 以下 FullyConnectLayer, PerceptronLayer 成立的條件是 w 預設為 0.2, bias 預設為 0.1
  describe('nn6.FullyConnectLayer', function() {
    it('FullyConnectLayer 2to1', function() {
      let fcLayer = new L.FullyConnectLayer(x, {n:1})
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      check(fcLayer, [-0.3], [0.2, 0.2])
    })
    it('FullyConnectLayer 2to2', function() {
      let fcLayer = new L.FullyConnectLayer(x, {n:2})
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      fcLayer.w.v[3] = 0.5
      check(fcLayer, [-0.3, -1.2], [0.4, 0.7])
    })
  })
  describe('nn6.PerceptronLayer', function() {
    it('PerceptronLayer 2to1', function() {
      let pLayer = new L.PerceptronLayer(x, {n:1})
      let fcLayer = pLayer.fcLayer
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      check(pLayer, [0.4256], [0.0489,0.0489])
    })
  })
})

/*
InputLayer, PoolLayer, DropoutLayer, RegressionLayer, SoftmaxLayer
*/