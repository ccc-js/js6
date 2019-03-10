const IPlugin = require('./IPlugin')

module.exports = class Plugin extends IPlugin {
  constructor(f) {
    super()
    this.f = f
  }

  call(p) { return this.f(p.p) }

  // 函數 f 對變數 k 的偏微分: df(p) / dk
  df (p, k, h=0.01) {
    let f = this.f
    let p1 = p.clone()
    p1.p[k] += h
    return (f(p1.p) - f(p.p)) / h
  } 

  // 函數 f 在點 p 上的梯度	∇f(p)
  grad (p) {
    let g = p.clone()
    for (let k in p.p) {
      g.p[k] = this.df(p, k) // 對變數 k 取偏導數後，放入梯度向量 gp 中
    }
    return g
  }

  isBetter(g, p, gap=0.00001) {
    return (g.norm() > gap)  // 梯度是否大於門檻值呢？
  }

  apply(g, p, step=0.01) {
    let gstep = g.mul(-1 * step) // gstep = 逆梯度方向的一小步
    return p.add(gstep) // 向逆梯度方向走一小步
  }
}
