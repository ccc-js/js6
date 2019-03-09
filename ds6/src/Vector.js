const uu6 = require('../../uu6')
const V = uu6.V

module.exports = class Vector {
  constructor(v=[]) { this.v = v }

  clone () {
    return new Vector(this.v.slice(0))
  }

  add (o) { return new Vector(V.add(this.v, o.v)) }
  
  sub (o) { return new Vector(V.sub(this.v, o.v)) }
  
  cmul (c) { return new Vector(V.cmul(c, this.v)) }
  
  neg () { return new Vector(V.neg(this.v)) }
  
  norm () { return V.norm(this.v) }
  
  json (n) {
    return 'Vector: ' + uu6.json(this.v, null, n || uu6.precision)
  }

  toString() { return this.json() }
}
