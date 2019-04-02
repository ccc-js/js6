const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
const V = ma6.V
const T = ma6.T
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
  /*
  static assign(t, o) {
    if (o instanceof ma6.Tensor) {
      return o.clone()
    } else {
      return t.assign(o)
    }
  }
  */
  constructor(shape, v, g) {
    super()
    // console.log('shape=', shape, 'v=', v, 'g=', g)
    let size = (v) ? v.length : T.size(shape)
    // console.log('size=', size)
    this._v = v || V.array(size, 0) // 輸出值 (f(x))
    // console.log('_v=', this._v)
    this._g = g || V.array(size, 0) // 梯度值 (偏微分)
    // console.log('_g=', this._g)
    this.shape = shape || [size]
    // console.log('shape=', this.shape)
    // console.log('TensorNode=', this.toString())
  }
  get v() { return this._v }
  set v(o) { V.assign(this._v, o) }
  get g() { return this._g }
  set g(o) { V.assign(this._g, o) }
  get length() { return this._v.length }
  toString() {
    // return 'xxx'
    return this.constructor.name + ' v:' + uu6.json(this._v) + ' g:' + uu6.json(this._g) + ' shape:' + uu6.json(this.shape)
    // return this.constructor.name + '\n  v:' + uu6.json(this._v) + '\n  g:', uu6.json(this._g) + '\n  shape:' + uu6.json(this.shape)
  }
}

class TensorVariable extends TensorNode {
  constructor(v, shape) {
    // let t = ma6.tensor(v, shape)
    // t.assign(0.8);
    super(shape, v)
  }
}

class TensorConstant extends TensorNode {
  constructor(v) {
    super(v)
    this._g = V.array(this._v.length, 0) // 常數的梯度值為零
  }
  set v(c) { } // 常數不能事後設定值
  set g(c) { } // 常數不能設定梯度
}

N.tensorVariable = function (v, shape) {
  // console.log('N.tensor:shape =', shape)
  // let v = new ma6.Tensor(null, shape)
  return new TensorVariable(v, shape)
}

N.tensorConstant = function (a) {
  let v = new ma6.Tensor(a)
  return new TensorConstant(v)
}

module.exports = Object.assign(N, {
  Constant, Variable, TensorVariable, TensorConstant
})