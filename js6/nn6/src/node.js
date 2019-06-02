const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
const V = ma6.V
const T = ma6.T
const N = {}

class Node {
  toString() {
    return 'v:' + this.v + ' g:' + this.g
  }
}

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
  constructor(v, shape) {
    super()
  }

  get length() { return this.v.length }

  toString() {
    return this.constructor.name + ' v:' + uu6.json(this.v) + ' g:' + uu6.json(this.g) + ' shape:' + uu6.json(this.shape)
  }
}

class TensorVariable extends TensorNode {
  constructor(v, shape) {
    super(v, shape)
    let size = (v) ? v.length : T.size({shape})
    this.v = v || V.array(size, 0) // 輸出值 (f(x))
    this.g = V.array(size, 0)      // 梯度值 (偏微分)
    this.shape = shape || [size]
  }
}

class TensorConstant extends TensorNode {
  constructor(v) {
    super()
    this._v = v || V.array(size, 0)      // 輸出值 (f(x))
  }
  get v() { return this._v }
  get g() { return 0 }
}

module.exports = Object.assign(N, {
  Constant, Variable, TensorVariable, TensorConstant
})