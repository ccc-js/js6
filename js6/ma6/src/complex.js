const C = module.exports = {}

C.toComplex = function (o) {
  if (typeof o === 'number')
    return new Complex(o, 0);
  else if (o instanceof Complex)
    return o;
  throw Error('toComplex fail');
}

C.polarToComplex = function (r,theta) {
  let cr = r*Math.cos(theta), ci = r*Math.sin(theta)
  return new Complex(cr, ci)
}

C.parseComplex = function(s) {
  let m = s.match(/^([^\+]*)(\+(.*))?$/)
  let r = parseFloat(m[1])
  let i = typeof m[3]==='undefined' ? 1 : parseFloat(m[3])
  return new Complex(r, i)
}

class Complex {
  constructor(r,i) {
    this.r = r; this.i = i
  }

  conj() { let {r,i} = this; return new Complex(r, -i) }
  neg() { let {r,i} = this; return new Complex(-r, -i) }
  add(b) { let {r,i} = this; return new Complex(r+b.r, i+b.i) }
  sub(b) { let {r,i} = this; return new Complex(r-b.r, i-b.i) }
  mul(b) { let {r,i} = this; return new Complex(r*b.r-i*b.i, r*b.i+i*b.r) }
	div(b) { return this.mul(b.pow(-1)) }
  clone() {  let {r,i} = this; return new Complex(r, i) }
  toString() {
    let {r,i} = this
    let op = (i < 0)?'':'+'
    return r + op + i + 'i'
  }
  
  toPolar() {
    let {r, i}=this
    let d=Math.sqrt(r*r+i*i)
    let theta = Math.acos(r/d)
    return {r:d, theta:theta}
  }
  
  pow(k) {
    let p = this.toPolar()
    return C.polarToComplex(Math.pow(p.r, k), k*p.theta)
  }
  
  sqrt() {
    return this.pow(1/2)
  }

  toFixed(digits=4) {
    let c = this.clone()
    c.r = parseFloat(c.r.toFixed(digits))
    c.i = parseFloat(c.i.toFixed(digits))
    return C.parseComplex(c.toString())
  }
}

C.complex = function (s) { return C.parseComplex(s) }

C.complexArray = function (s) {
  let c = s.split(','), len = c.length
  let rt = new Array(len), it = new Array(len)
  for (let i=0; i<len; i++) {
    let ci = C.complex(c[i])
    rt[i] = ci.r; it[i] = ci.i
  }
  return {r: rt, i:it }
}

Object.assign(C, { Complex })
