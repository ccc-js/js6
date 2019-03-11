const P = module.exports = {}

const V = require('./vector')

class Point extends V.Vector {
  constructor(o) { super(o) }
  static call(f, p) {
    return f(p.v)
  }
  static grad(f, p, h=0.01) {
    let len = p.size(), fp = f(p.v)
    let p2= p.clone(), v2 = p2.v
    let g = new Array(p.size())
    for (let i=0; i<len; i++) {
      let t = v2[i]
      v2[i] += h
      g[i] = (f(p2.v) - fp) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      v2[i] = t
    }
    return new V.Vector(g)
  }
/*
  grad(f, h=0.01) {
    let p = this, len = p.size(), fp = f(p)
    let p2= p.clone(), v2 = p2.v
    let g = new Array(p.size())
    for (let i=0; i<len; i++) {
      let t = v2[i]
      v2[i] += h
      g[i] = (f(p2) - fp) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      v2[i] = t
    }
    return new Vector(g)
  }
*/
  clone(v) { return new Point(v||this.v) }
}

P.Point = Point