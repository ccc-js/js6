const expect = require('../../../js6/se6').expect
const uu6 = require('../../../js6/uu6')
const nn6 = require('../../../js6/nn6')
const ma6 = require('../../../js6/ma6')
const V = ma6.V
const L = nn6.L

let x = new nn6.TensorVariable([2, -3])
let m = new nn6.TensorVariable([1.0, 0, 1.1, 0, 0, 1.2, 0, 1.3, 0, 0, 0, 1.4, 0, 0, 2.0, 0], [1, 4, 4])
console.log('x=', x.toString())
console.log('m=', m.toString())

function check(layer) {
  let {x,o} = layer
  let gx1 = layer.grad()
  console.log('gx1:numeric =', uu6.json(gx1))
  layer.forward()
  console.log('forward() x=', x.toString(), 'o=', o.toString())
  V.assign(o.g, 1)
  layer.backward()
  let gx2 = x.g
  V.normalize(gx2)
  console.log('gx2:backprop=', uu6.json(gx2))
  expect(gx2).to.near(gx1)
}

describe('nn6.Layer', function() {
  describe('nn6.FLayer', function() {
    it('Relu Layer', function() {
      check(new L.ReluLayer(x, 0.0))
    })
    it('Relu(leaky=0.1) Layer', function() {
      check(new L.ReluLayer(x, 0.1))
    })
    it('Sigmoid Layer', function() {
      check(new L.SigmoidLayer(x))
    })
    it('Tanh Layer', function() {
      check(new L.TanhLayer(x))
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
    it('RegressionLayer(x, y=[3, 0])', function() {
      let y = [3, 0]
      let layer = new L.RegressionLayer(x)
      layer.setOutput(y)
      check(layer)
    })
  })
  // 以下 FullyConnectLayer, PerceptronLayer 成立的條件是 w 預設為 0.2, bias 預設為 0.1
  describe('nn6.FullyConnectLayer', function() {
    it('FullyConnectLayer 2to1', function() {
      let fcLayer = new L.FullyConnectLayer(x, {n:1, cw:0.2, cbias:0.1})
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      check(fcLayer)
    })
    it('FullyConnectLayer 2to2', function() {
      let fcLayer = new L.FullyConnectLayer(x, {n:2, cw:0.2, cbias:0.1})
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      fcLayer.w.v[3] = 0.5
      check(fcLayer)
    })
  })
  describe('nn6.FcActLayer', function() {
    it('FcActLayer 2to1', function() {
      let pLayer = new L.FcActLayer(x, {n:1, cw:0.2, cbias:0.1, ActLayer:L.ReluLayer })
      let fcLayer = pLayer.fcLayer
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      check(pLayer)
    })
  })
  describe('nn6.PerceptronLayer', function() {
    it('PerceptronLayer 2to1', function() {
      let pLayer = new L.PerceptronLayer(x, {n:1, cw:0.2, cbias:0.1})
      let fcLayer = pLayer.fcLayer
      uu6.be(fcLayer.w.v[0] == 0.2 && fcLayer.bias.v[0] == 0.1)
      check(pLayer)
    })
  })
  describe('nn6.SoftmaxLayer', function() {
    it('SoftmaxLayer', function() {
      let layer = new L.SoftmaxLayer(x)
      layer.y = 0
      check(layer)
    })
  })
  describe('nn6.DropoutLayer', function() {
    it('DropoutLayer', function() {
      let layer = new L.DropoutLayer(x, {dropProb: 0.0, isTraining:false })
      check(layer)
    })
  })
  describe('nn6.PoolLayer', function() {
    it('PoolLayer', function() {
      let layer = new L.PoolLayer(m, {fw:3, fh:3, stride:1, pad:0})
      check(layer)
    }) 
  })
  describe('nn6.ConvLayer', function() {
    it('ConvLayer', function() {
      let layer = new L.ConvLayer(m, {od:1, fw:3, fh:3, stride:1, pad:0, cw:0.2, cbias:0.1})
      check(layer)
    })
    it('ConvLayer', function() {
      let layer = new L.ConvLayer(m, {od:1, fw:3, fh:3, stride:1, pad:2, cw:0.3, cbias:0.0})
      check(layer)
    })
    it('ConvLayer', function() {
      let layer = new L.ConvLayer(m, {od:1, fw:3, fh:3, stride:2, pad:2, cw:0.1, cbias:0.2})
      check(layer)
    })
    it('ConvLayer', function() {
      let layer = new L.ConvLayer(m, {od:1, fw:3, fh:3, stride:2, pad:2 })
      check(layer)
    })
  })
})

/*
PoolLayer, DropoutLayer, SoftmaxLayer
*/