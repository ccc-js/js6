const uu6 = require('../../uu6')
const V = module.exports = {}

V.array = uu6.array

V.random = function (r, min=0, max=1) {
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = uu6.random(min, max)
  }
}

V.assign = function (r, o) {
  let isC = (typeof o === 'number')
  if (!isC) uu6.be(r.length === o.length)
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = isC ? o : o[i]
  }
  return r
}

V.normalize = function (r) {
  let ar = V.abs(r)
  let s = V.sum(ar) // 不能用 sum，sum 只適用於機率。
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = r[i]/s
  }
  return r
}

V.oadd = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] + b[i]
}

V.osub = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] - b[i]
}

V.omul = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] * b[i]
}

V.odiv = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] / b[i]
}

V.omod = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] % b[i]
}

V.opow = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.pow(a[i], b[i])
}

V.op2 = function (a, b, f2) {
  uu6.be(a.length === b.length)
  let len = a.length
  let r = new Array(len)
  f2(r, a, b, len)
  return r
}

V.add = function (a, b) { return V.op2(a, b, V.oadd) }
V.sub = function (a, b) { return V.op2(a, b, V.osub) }
V.mul = function (a, b) { return V.op2(a, b, V.omul) }
V.div = function (a, b) { return V.op2(a, b, V.odiv) }
V.mod = function (a, b) { return V.op2(a, b, V.omod) }
V.pow = function (a, b) { return V.op2(a, b, V.opow) }

// Constant Operation
V.oaddc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] + c
}

V.osubc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] - c
}

V.omulc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] * c
}

V.odivc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] / c
}

V.omodc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] % c
}

V.opowc = function (r, a, c, len) {
  for (let i = 0; i < len; i++) r[i] = Math.pow(a[i], c)
}

V.opc = function (a, c, fc) {
  let len = a.length
  let r = new Array(len)
  fc(r, a, c, len)
  return r
}

V.addc = function (a, c) { return V.opc(a, c, V.oaddc) }
V.subc = function (a, c) { return V.opc(a, c, V.osubc) }
V.mulc = function (a, c) { return V.opc(a, c, V.omulc) }
V.divc = function (a, c) { return V.opc(a, c, V.odivc) }
V.modc = function (a, c) { return V.opc(a, c, V.omodc) }
V.powc = function (a, c) { return V.opc(a, c, V.opowc) }

// Uniary Operation
V.oneg = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = -a[i]
}

V.oabs = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.abs(a[i])
}

V.op1 = function (a, f1) {
  let len = a.length
  let r = new Array(len)
  f1(r, a, len)
  return r
}

V.neg = function (a) { return V.op1(a, V.oneg) }
V.abs = function (a) { return V.op1(a, V.oabs) }
/*
V.neg = function (a) {
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = -a[i]
  }
  return r
}
*/
V.dot = function (a,b) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r += a[i] * b[i]
  }
  return r
}

V.sum = function(a) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r += a[i]
  }
  return r
}

V.product = function(a) {
  let len = a.length
  let r = 1
  for (let i=0; i<len; i++) {
    r *= a[i]
  }
  return r
}

V.norm = function (a) {
  let a2 = V.powc(a, 2)
  return Math.sqrt(V.sum(a2))
}

V.mean = function(a) {
  return V.sum(a)/a.length
}

V.sd = function (a) {
  let m = V.mean(a)
  let diff = V.subc(a, m)
  let d2 = V.powc(diff, 2)
  return Math.sqrt(V.sum(d2)/(a.length-1))
}

class Vector {
  constructor(o) { this.v = (Array.isArray(o))?o.slice(0):new Array(o) }
  static random(n, min=0, max=1) { return new Vector(V.random(n, min, max)) }
  static range(begin, end, step=1) { return new Vector(V.range(begin, end, step)) }
  static zero(n) { return new Vector(n) }
  assign(o) { let a=this; V.assign(a.v, o); return a }
  random(min=0, max=1) { this.v = V.random(n, min, max) }
  add(b) { let a=this; return a.clone(V.add(a.v,b.v)) }
  sub(b) { let a=this; return a.clone(V.sub(a.v,b.v)) } 
  mul(b) { let a=this; return a.clone(V.mul(a.v,b.v)) } 
  div(b) { let a=this; return a.clone(V.div(a.v,b.v)) } 
  mod(b) { let a=this; return a.clone(V.mod(a.v,b.v)) } 
  mulc(c) { let a=this; return a.clone(V.mulc(a.v,c)) } 
  divc(c) { let a=this; return a.clone(V.divc(a.v,c)) } 
  addc(c) { let a=this; return a.clone(V.addc(a.v,c)) } 
  subc(c) { let a=this; return a.clone(V.subc(a.v,c)) } 
  powc(c) { let a=this; return a.clone(V.powc(a.v,c)) }
  neg() { let a=this; return a.clone(V.neg(a.v)) }
  dot(b) { let a=this; return V.dot(a.v,b.v) } 
  sum() { let a=this; return V.sum(a.v) }
  norm() { let a=this; return V.norm(a.v)  }
  mean() { let a=this; return V.mean(a.v) }
  sd() { let a=this; return V.sd(a.v) }
  toString() { return this.v.toString() }
  clone(v) { return new Vector(v||this.v) }
  get length() { return this.v.length }
  // size() { return this.v.length }
}

V.Vector = Vector

V.vector = function (o) {
  return new Vector(o)
}

/*
V.new = function (n, value = 0) {
  let a = new Array(n)
  return a.fill(value)
}

V.fill = function (a, value = 0) {
  return a.fill(value)
}

V.range = function (begin, end, step=1) {
  let len = Math.floor((end-begin)/step)
  let a = new Array(len)
  let i = 0
  for (let t=begin; t<end; t+=step) {
    a[i++] = t
  }
  return a
}

V.random = function (len, min=0, max=1) {
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = R.random(min, max)
  }
  return r
}
*/
