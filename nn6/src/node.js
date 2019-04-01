const ma6 = require('../../ma6')
const uu6 = require('../../uu6')

const N = {}

class Node {}

class Constant extends Node {
  constructor(v = 0) {
    super()
    this._v = v
  }
  get v() { return this._v }
  set v(c) { } // 常數不能事後設定值
  get g() { return 0 } // 常數的梯度 = 0
  set g(c) { } // 常數不能設定梯度
}

class Variable extends Node {
  constructor(v = 0, g = 0) {
    super()
    this.v = v // 輸出值 (f(x))
    this.g = g // 梯度值 (偏微分)
  }
}

class TensorNode extends Node {
  static assign(t, o) {
    if (o instanceof ma6.Tensor) {
      return o.clone()
    } else {
      return t.assign(o)
    }
  }
  constructor(v, g) {
    uu6.be(v instanceof ma6.Tensor)
    super()
    this._v = v // 輸出值 (f(x))
    // console.log('TensorNode:v=', v)
    g = g || v.clone().assign(0)
    this._g = g // 梯度值 (偏微分)
  }
  get v() { return this._v }
  set v(o) {
    this._v = TensorNode.assign(this._v, o)
  }
  get g() { return this._g }
  set g(o) {
    this._g = TensorNode.assign(this._g, o)
  }
  toString() {
    return uu6.json({v:this.v, g:this.g})
  }
}

class TensorVariable extends TensorNode {
  constructor(shape) {
    let t = ma6.tensor(null, shape)
    t.assign(0.8);
    super(t)
  }
}

class TensorConstant extends TensorNode {
  constructor(v) {
    super(v)
    this._g = ma6.Tensor.zero(this._v.length) // 常數的梯度值為零
  }
  set v(c) { } // 常數不能事後設定值
  set g(c) { } // 常數不能設定梯度
}

N.tensorVariable = function (shape) {
  // console.log('N.tensor:shape =', shape)
  // let v = new ma6.Tensor(null, shape)
  return new TensorVariable(shape)
}

N.tensorConstant = function (a) {
  let v = new ma6.Tensor(a)
  return new TensorConstant(v)
}

module.exports = Object.assign(N, {
  Constant, Variable, TensorVariable, TensorConstant
})