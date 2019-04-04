const expect = require('../../../se6').expect
const uu6 = require('../../../uu6')
const nn6 = require('../../../nn6')
const ma6 = require('../../../ma6')
const V = ma6.V
const L = nn6.L

let x = new nn6.TensorVariable([2, -3])
console.log('x=', x.toString())

function check(layer) {
  let {x,o} = layer
  let gx1 = layer.grad()
  console.log('gx1:numeric =', gx1)
  layer.forward()
  V.assign(o.g, 1)
  layer.backward()
  let gx2 = x.g
  V.normalize(gx2)
  console.log('gx2:backprop=', gx2)
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
      /* -- 這裡有錯，負加正 normalize 之後

gx1:numeric = [ 0.4745762711864407, 0.5254237288135594 ]
y= 0
e= [ 1, 0.006737946999085467 ]
o.v= [ 0.9933071490757153, 0.006692850924284856 ]
x.g= [ -0.006692850924284732, 0.006692850924284856 ] <-- 這個  normalize 之後有問題，會變得超大 ....
但是只用 normalize 加上 abs 也是不行的 .... 該如何解決才能和數值法算出來的一樣呢？
gx2:backprop= [ -53960361942207.555, 53960361942208.555 ]
*/
    })
  })
})

/*
PoolLayer, DropoutLayer, SoftmaxLayer
*/