const IPlugin = require('./IPlugin')

module.exports = class Plugin extends IPlugin {
  constructor(f) {
    super()
    this.f = f
  }

  call(p) {
    return this.f(p.v)
  }

  // 函數 f 在點 p 上的梯度	∇f(p)
  grad (p, h=0.01) {
    let v = p.v, len = v.length, g = p.clone(), p1 = p.clone(), f=this.f
    for (let i=0; i<len; i++) {
      let vi = p1.v[i]
      p1.v[i] += h
      g.v[i] = (f(p1.v) - f(p.v)) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      p1.v[i] = vi
    }
    return g
  }

  isBetter(g, p, gap=0.00001) {
    return (g.norm() > gap)  // 梯度是否大於門檻值呢？
  }

  apply(g, p, step=0.01) {
    let gstep = g.cmul(-1 * step) // gstep = 逆梯度方向的一小步
    return p.add(gstep) // 向逆梯度方向走一小步
  }
}
