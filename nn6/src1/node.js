const ma6 = require('../../ma6')

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
  static set(t, o) {
    if (o instanceof Tensor) {
      return o.clone()
    } else {
      return t.set(o)
    }
  }
  constructor(v, g) {
    super()
    this._v = v // 輸出值 (f(x))
    g = g || v.clone().set(0)
    this._g = g // 梯度值 (偏微分)
  }
  get v() { return this._v }
  set v(o) {
    this._v = TensorNode.set(this._v, o)
  }
  get g() { return this._g }
  set g(o) {
    this._g = TensorNode.set(this._v, o)
  }
}

class TensorVariable extends TensorNode {}

class TensorConstant extends TensorNode {
  constructor(v) {
    super(v)
    this._g = ma6.Tensor.zero(this._v.length) // 常數的梯度值為零
  }
  set v(c) { } // 常數不能事後設定值
  set g(c) { } // 常數不能設定梯度
}

N.variables = function (n) {
  let v = new ma6.Tensor(new Array(n))
  return new TensorVariable(v)
}

N.constants = function (a) {
  let v = new ma6.Tensor(a)
  return new TensorConstant(v)
}

module.exports = Object.assign(N, {
  Constant, Variable, TensorVariable, TensorConstant
})