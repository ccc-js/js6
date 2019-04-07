const P = module.exports = {}

const V = require('./vector')

class Point extends V.Vector {
  constructor(o) { super(o) }
  static call(f, p) {
    return f(p.v)
  }
  static grad(f, p, h=0.01) {
    let len = p.length, fp = f(p.v)
    let p2= p.clone(), v2 = p2.v
    let g = new Array(p.length)
    for (let i=0; i<len; i++) {
      let t = v2[i]
      v2[i] += h
      g[i] = (f(p2.v) - fp) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      v2[i] = t
    }
    return new V.Vector(g)
  }

  static step(p, g, stepLen) {
    let d = g.mulc(stepLen)
    return  p.add(d)
  }

  static distance(x, y) {
    return x.sub(y).norm()
  }
  // be(d(x,y)>=0);
  // be(d(x,x)==0);
  // be(d(x,y)==d(y,x));
  distance(y) {
    return Point.distance(this, y)
  }

  clone(v) { return new Point(v||this.v) }
}

P.Point = Point
