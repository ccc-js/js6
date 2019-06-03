const C = module.exports = {}

C.complex = function(s) {
  let m = s.match(/^([^\+]*)(\+(.*))?$/)
  let r = parseFloat(m[1])
  let i = typeof m[3]==='undefined' ? 1 : parseFloat(m[3])
  return {r, i}
}

C.polarToComplex = function (p) {
  return {r: p.radius*Math.cos(p.theta), i: p.radius*Math.sin(p.theta)}
}

C.complexToPolar = function (a) {
  let {r, i}=a
  let d=Math.sqrt(r*r+i*i)
  let theta = Math.acos(r/d)
  return {radius:d, theta:theta}
}

C.conj = function (a) { return {r:a.r, i:-a.i} }
C.neg = function (a) { return {r:-a.r, i:-a.i} }
C.add = function (a,b) { return {r:a.r+b.r, i:a.i+b.i} }
C.sub = function (a,b) { return {r:a.r-b.r, i:a.i-b.i} }
C.mul = function (a,b) { return {r:a.r*b.r-a.i*b.i, i:a.r*b.i+a.i*b.r} }
C.div = function (a,b) { return C.mul(a, C.pow(b, -1)) }
C.pow = function (a,k) { // https://math.stackexchange.com/questions/476968/complex-power-of-a-complex-number
  let p = C.complexToPolar(a)
  return C.polarToComplex({radius:Math.pow(p.radius, k), theta:k*p.theta })
}
C.sqrt = function (a) {
  return C.pow(a, 1/2)
}
C.str = function (a, digits=4) {
  let r = a.r.toFixed(digits)
  let i = a.i.toFixed(digits)
  let op = (a.i < 0)?'':'+'
  return r + op + i + 'i'
}
C.toFixed = function (c) {
  c.r = parseFloat(c.r.toFixed(digits))
  c.i = parseFloat(c.i.toFixed(digits))
  return C.complex(c.toString())
}

C.complexArray = function (s) {
  let c = s.split(','), len = c.length
  let rt = new Array(len), it = new Array(len)
  for (let i=0; i<len; i++) {
    let ci = C.complex(c[i])
    rt[i] = ci.r; it[i] = ci.i
  }
  return {r: rt, i:it }
}

/*
class Complex {
  constructor(a) {
    let t = typeof a
    if (t === 'string') { a = C.complex(a); t = typeof a }
    if (t === 'object') { this.r = a.r; this.i = a.i; return }
    // console.log('Complex:a=%j', a)
    throw Error('Complex.constructor error: a='+a.toString())
  }
  conj() { return new Complex(C.conj(this)) }
  neg() { return new Complex(C.neg(this)) }
  add(b) { return new Complex(C.add(this, b)) }
  sub(b) { return new Complex(C.sub(this, b)) }
  mul(b) { return new Complex(C.mul(this, b)) }
	div(b) { return new Complex(C.div(this, b)) }
  clone() { return new Complex(this) }
  toString() { return C.str(this) }
  toPolar() { return C.complexToPolar(this) }
  pow(k) { return new Complex(C.pow(this, k)) }
  sqrt() { return new Complex(C.sqrt(this)) }
  toFixed(digits=4) { return C.toFixed(this) }
}

Object.assign(C, { Complex })
*/
// C.complex = function (s) { return C.parseComplex(s) }