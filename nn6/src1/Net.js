const N = require('./node')
const G = require('./gate')
const F = require('./func')
// const ma6 = require('../../ma6')
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

  constructor () {
    this.gates = []
    this.vars = []
    this.watchNodes = []
  }

  variable (v, g) {
    let node = new N.Variable(v, g)
    this.vars.push(node)
    return node
  }
  
  constant (v) { return new N.Constant(v) }

  variables (n) {
    let node = N.variables(n)
    this.vars.push(node)
    return node
  }

  constants (a) { return N.constants(a) }

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
  exp (x) { return this.op1(x, F.exp, F.dexp) }
  relu (x, leaky=0) { return this.op1(x, (x)=>F.relu(x, leaky), (x)=>F.drelu(x, leaky)) }
  sigmoid (x) { return this.op1(x, F.sigmoid, F.dsigmoid) }
  tanh (x) { return this.op1(x, F.tanh, F.dtanh) }

  // op2
  add (x, y) { return this.op2(x, y, (x,y)=>x+y, (x,y)=>1) }
  sub (x, y) { return this.op2(x, y, (x,y)=>x-y, (x,y)=>1, (x,y)=>-1) }
  mul (x, y) { return this.op2(x, y, (x,y)=>x*y, (x,y)=>y, (x,y)=>x) }
  div (x, y) { return this.op2(x, y, (x,y)=>x/y, (x,y)=>1/y, (x,y)=>-x/(y*y)) }
  pow (x, y) { return this.op2(x, y, F.pow, F.dpowx, F.dpowy) }

  forward() { // 正向傳遞計算結果
    for (let gate of this.gates) {
      gate.forward()
    }
    return this.o
  }

  backward() { // 反向傳遞計算梯度
    this.o.g = 1 // 設定輸出節點 o 的梯度為 1
    for (let i=this.gates.length-1; i>=0; i--) { // 反向傳遞計算每個節點 Node 的梯度 g
      let gate = this.gates[i]
      gate.backward()
    }
  }

  watch (nodes) {
    this.watchNodes = nodes
  }

  toString() {
    return uu6.json(this.watchNodes)
  }
}

/*
  // Tensor
  top1 (x, f, gf) {
    let o = new N.Variables(x.clone())
    let g = new G.TensorGate1(o, x, f, gf)
    this.gates.push(g)
    this.o = o
    return o
  }
  top2 (x, y, f, gf) {
    let o = new N.Variables(x.clone())
    let g = new G.TensorGate2(o, x, y, f, gf)
    this.gates.push(g)
    this.o = o
    return o
  }
  topN (x, f, gf) {
    let o = new N.Variables(x.clone())
    let g = new G.TensorGateN(o, x, f, gf)
    this.gates.push(g)
    this.o = o
    return o
  }

  tadd (x, y) { return this.top2(x, y, (o,x,y)=>T.oadd(o.v, x.v, y.v), (o,x,y)=>{ T.oassign(x.g, o.g); T.oassign(y.g, o.g) } ) }
  tmul (x, y) { return this.top2(x, y, (o,x,y)=>T.omul(o.v, x.v, y.v), (o,x,y)=>{ T.omul(x.g, y.v, o.g); T.omul(y.g, x.v, o.g) } ) }
  tsum (x) { return this.topN(x, (o,x)=>o.v = T.sum(x.v), (o,x)=>{ T.oaddc(x.g, o.g) } ) }
  tsigmoid (x) { return this.top1(x, (o,x)=>T.osigmoid(o.v, x.v), (o,x)=>{ T.odsigmoid(x.g, o.g) } ) }
*/