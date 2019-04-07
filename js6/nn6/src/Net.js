const N = require('./node')
const G = require('./gate')
const L = require('./layer')
const F = require('./func')
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')

module.exports = class Net {
  static call(net, p) {
    let o = net.forward()
    return o.v
  }

  static grad(net, p) {
    net.backward()
    return net
  }

  static step(p, gnet, stepLen) {
    for (let node of gnet.vars) {
      node.v += stepLen * node.g
    }
    return gnet
  }

  constructor (p={}) {
    this.gates = []
    this.vars = []
    this.step = p.step || -0.01
    this.moment = p.moment || 0
  }

  variable (v, g) {
    let node = new N.Variable(v, g)
    this.vars.push(node)
    return node
  }
  
  constant (v) { return new N.Constant(v) }

  tensorVariable (shape) {
    let node = new N.TensorVariable(null, shape)
    this.vars.push(node)
    return node
  }

  tensorConstant (a) { return new N.TensorConstant(a) }

  op1 (x, f, gfx) {
    let o = new N.Variable()
    let g = new G.Gate1(o, x, f, gfx)
    this.gates.push(g)
    this.o = o
    return o
  }

  op2 (x, y, f, gfx, gfy) {
    let o = new N.Variable()
    let g = new G.Gate2(o, x, y, f, gfx, gfy)
    this.gates.push(g)
    this.o = o
    return o
  }

  // op1
  neg (x) { return this.op1(x, (x)=>-x, (x)=>-1) }
  rev (x) { return this.op1(x, (x)=>1/x, (x)=>-1/(x*x)) }
  /* 這些要從輸出值 o 回饋 
  exp (x) { return this.op1(x, F.exp, F.dexp) }
  relu (x, leaky=0) { return this.op1(x, (x)=>F.relu(x, leaky), (x)=>F.drelu(x, leaky)) }
  sigmoid (x) { return this.op1(x, F.sigmoid, F.dsigmoid) }
  tanh (x) { return this.op1(x, F.tanh, F.dtanh) }
  */
  // op2
  add (x, y) { return this.op2(x, y, (x,y)=>x+y, (x,y)=>1) }
  sub (x, y) { return this.op2(x, y, (x,y)=>x-y, (x,y)=>1, (x,y)=>-1) }
  mul (x, y) { return this.op2(x, y, (x,y)=>x*y, (x,y)=>y, (x,y)=>x) }
  div (x, y) { return this.op2(x, y, (x,y)=>x/y, (x,y)=>1/y, (x,y)=>-x/(y*y)) }
  pow (x, y) { return this.op2(x, y, F.pow, F.dpowx, F.dpowy) }

  // Layer
  inputLayer(shape) {
    let iLayer = new L.InputLayer(shape)
    this.gates.push(iLayer)
    this.i =iLayer.x
    this.o = iLayer.o
    return iLayer
  }

  push(Layer, p) {
    let lastLayer = this.gates[this.gates.length-1]
    let x = lastLayer.o
    let thisLayer = new Layer(x, p)
    this.gates.push(thisLayer)
    this.o = thisLayer.o
    return thisLayer
  }

  forward() { // 正向傳遞計算結果
    let len = this.gates.length
    for (let i=0; i<len; i++) {
      this.gates[i].forward()
    }
    return this.o
  }

  backward() { // 反向傳遞計算梯度
    if (typeof this.o.g === 'number') this.o.g = 1 // 單變數輸出，非向量，這是優化問題，直接將梯度設為 1
    let len = this.gates.length
    for (let i=len-1; i>=0; i--) { // 反向傳遞計算每個節點 Node 的梯度 g
      let gate = this.gates[i]
      gate.backward()
    }
  }

  adjust(step, moment) {
    let len = this.gates.length
    for (let i=0; i<len; i++) {
      this.gates[i].adjust(step, moment)
    }
  }

  setInput(input) { this.gates[0].setInput(input) }
  setOutput(out) { this.lastGate().setOutput(out) }

  lastGate() { return this.gates[this.gates.length-1] }
  predict() { return this.lastGate().predict }
  loss() { return this.lastGate().loss }

  learn(input, out) {
    this.setInput(input)
    this.setOutput(out)
    this.forward()
    this.backward()
    this.adjust(this.step, this.moment)
    return this.loss()
  }

  dump(p) {
    let {inputs, outs} = p
    let len = inputs.length
    for (let i=0; i<len; i++) {
      this.setInput(inputs[i])
      this.setOutput(outs[i])
      this.forward()
      console.log('input:', inputs[i], 'out:', outs[i], 'predict:', uu6.json(this.predict()), 'loss:', this.loss())
    }
  }

  optimize(p) {
    let {inputs, outs, gap, minLoops, maxLoops} = p
    uu6.be(inputs && outs)
    gap = gap || 0.00001
    let len = inputs.length
    let loss0 = Number.MAX_VALUE
    for (let loops=0; loops < maxLoops; loops++) {
      let loss = 0
      for (let i=0; i<len; i++) {
        loss += this.learn(inputs[i], outs[i])
      }
      if (loss < loss0 - gap)
        loss0 = loss
      else if (loops >= minLoops)
        break
      console.log(loops+': loss=', loss)
    }
    this.dump(p)
  }

  watch (nodeMap) {
    this.watchNodes = nodeMap
  }

  toString() {
    let watchNodes = this.watchNodes || {i:this.i, o:this.o}
    console.log('watchNodes=', watchNodes)
    let list=[]
    for (let key in watchNodes) {
      list.push('  ' + key + ":" + watchNodes[key].toString())
    }
    return this.constructor.name + ':\n' + list.join("\n")
  }
}
