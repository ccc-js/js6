module.exports = G = {}

class Gate {
  constructor(o, x) {
    this.x = x
    this.o = o
  }
  setOutput(y) { this.y = y }
  get predict() { return this.o.v }
}

class Gate1 extends Gate {
  constructor(o, x, f, gfx) {
    super(o, x)
    this.p = {o, x, f, gfx}
  }

  forward() {
    let {o, x, f} = this.p
    o.v = f(x.v)
    o.g = x.g = 0
  }

  backward() {
    let {o, x, gfx} = this.p
    x.g += gfx(x.v) * o.g
  }

  adjust(step, moment) {
    let {x,y} = this.p
    x.v += step * x.g
    x.g = o.g = 0
  }
}

class Gate2 extends Gate {
  constructor(o, x, y, f, gfx, gfy) {
    super(o, x)
    this.p = {o, x, y, f, gfx, gfy:gfy||gfx}
  }

  forward() {
    let {o, x, y, f} = this.p
    o.v = f(x.v, y.v)
    o.g = x.g = y.g = 0
  }

  backward() {
    let {o,x,y,gfx,gfy} = this.p
    x.g += gfx(x.v, y.v) * o.g
    y.g += gfy(x.v, y.v) * o.g
  }

  adjust(step, moment) {
    let {x,y,o} = this.p
    x.v += step * x.g
    y.v += step * y.g
    x.g = y.g = o.g = 0
  }
}

Object.assign(G, {Gate, Gate1, Gate2 })
