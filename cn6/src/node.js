class Node {}

class Constant extends Node {
  constructor(v = 0) {
    super()
    this.val = v
  }
  get v() { return this.val }
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

module.exports = {
  Constant, Variable
}