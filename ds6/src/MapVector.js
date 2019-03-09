const uu6 = require('../../uu6')
const Vector = require('./Vector')

module.exports = class MapVector extends Vector {
  constructor(o={}) {
    super(null)
    this.o = {...o}
  }

  clone () {
    return new MapVector({...this.o})
  }

  add (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  sub (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  dot (v2) {
    let o1=this.o, o2=v2.o, r=0
    for (let k in o1) {
      r += o1[k] * o2[k]
    }
    return r
  }
  
  mul (c) {
    let v = this.clone(), o0=v.o, o1=this.o
    for (let k in o1) {
      o0[k] = o1[k] * c
    }
    return v
  }
  
  neg () {
    return this.mul(-1)
  }

  sum () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k]
    }
    return r
  }

  norm () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k] * o[k]
    }
    return Math.sqrt(r)
  }

  json (n=4) {
    return uu6.json(this.p, null, n)
  }
}
