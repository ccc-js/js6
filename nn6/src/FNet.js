const gd6 = require('../../gd6')
module.exports = class FNet {

  constructor(net, vars) {
    this.net = net
    this.vars = vars
  }

  setValues(p) {
    for (let k in p) {
      this.vars[k].v = p[k]
    }
  }

  getGrads() {
    let grads = {}
    for (let k in this.vars) {
      grads[k] = this.vars[k].g
    }
    return grads
  }

  call(point) {
    this.setValues(point.p)
    let o = this.net.forward()
    return o.v
  }

  grad(point) {
    this.call(point.p)
    this.net.backward()
    return new gd6.Point(this.getGrads())
  }

  isBetter(g, p, gap=0.00001) {
    return (g.norm() > gap)  // 梯度是否大於門檻值呢？
  }
  
  json() {
    return uu6.json(this.net.dump())
  }
}
