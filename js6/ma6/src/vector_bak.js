const uu6 = require('../../uu6')
const V = module.exports = {}

V.array = uu6.array

V.range = uu6.range
V.steps = uu6.steps

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
    r[i] = (s==0) ? 0 : r[i]/s
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

// logical
V.oand = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] && b[i]
}

V.oor  = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] || b[i]
}

V.oxor  = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = ( a[i] || b[i] ) && !( a[i] && b[i] )
}

// compare
V.olt = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] < b[i]
}

V.ogt = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] > b[i]
}

V.oeq = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] === b[i]
}

V.oneq = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] !== b[i]
}

V.oleq = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] <= b[i]
}

V.ogeq = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] >= b[i]
}

// bit operator
V.oband = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] & b[i]
}

V.obor = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] | b[i]
}

V.obxor = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] ^ b[i]
}

V.op2 = function (a, b, f2) {
  uu6.be(Array.isArray(a) && a.length === b.length)
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
V.and = function (a, b) { return V.op2(a, b, V.oand) }
V.or  = function (a, b) { return V.op2(a, b, V.oor) }
V.xor = function (a, b) { return V.op2(a, b, V.oxor) }
V.eq  = function (a, b) { return V.op2(a, b, V.oeq) }
V.neq = function (a, b) { return V.op2(a, b, V.oneq) }
V.lt  = function (a, b) { return V.op2(a, b, V.olt) }
V.gt  = function (a, b) { return V.op2(a, b, V.ogt) }
V.leq = function (a, b) { return V.op2(a, b, V.oleq) }
V.geq = function (a, b) { return V.op2(a, b, V.ogeq) }
V.band= function (a, b) { return V.op2(a, b, V.oband) }
V.bor = function (a, b) { return V.op2(a, b, V.obor) }
V.bxor= function (a, b) { return V.op2(a, b, V.obxor) }

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

V.oandc = function (r, a, c, len) {
  for (let i = 0; i < len; i++) r[i] = a[i] && c
}

V.ocadd = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c + a[i]
}

V.ocsub = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c - a[i]
}

V.ocmul = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c * a[i]
}

V.ocdiv = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c / a[i]
}

V.ocmod = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c % a[i]
}

V.ocpow = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.pow(c, a[i])
}

V.ocand = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = c && a[i]
}

V.opc = function (a, c, fc) {
  uu6.be(Array.isArray(a) && !Array.isArray(c))
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
V.andc = function (a, c) { return V.opc(a, c, V.oandc) }
V.ltc = function (a, c) { return V.opc(a, c, V.oltc) }

V.cadd = function (c, a) { return V.opc(a, c, V.ocadd) }
V.csub = function (c, a) { return V.opc(a, c, V.ocsub) }
V.cmul = function (c, a) { return V.opc(a, c, V.ocmul) }
V.cdiv = function (c, a) { return V.opc(a, c, V.ocdiv) }
V.cmod = function (c, a) { return V.opc(a, c, V.ocmod) }
V.cpow = function (c, a) { return V.opc(a, c, V.ocpow) }
V.cand = function (c, a) { return V.opc(a, c, V.ocand) }
V.clt  = function (c, a) { return V.opc(a, c, V.oclt) }

// Uniary Operation
V.oneg = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = -a[i]
}

V.oabs = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.abs(a[i])
}

V.olog = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.log(a[i])
}

V.onot = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = !a[i]
}

V.op1 = function (a, f1) {
  let len = a.length
  let r = new Array(len)
  f1(r, a, len)
  return r
}

V.neg = function (a) { return V.op1(a, V.oneg) }
V.abs = function (a) { return V.op1(a, V.oabs) }
V.log = function (a) { return V.op1(a, V.olog) }
V.not = function (a) { return V.op1(a, V.onot) }

V.dot = function (a,b) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r += a[i] * b[i]
  }
  return r
}

V.min = function (a) {
  let len = a.length, r = a[0]
  for (let i=1; i<len; i++) {
    if (a[i] < r) r = a[i]
  }
  return r
}

V.max = function (a) {
  let len = a.length, r = a[0]
  for (let i=1; i<len; i++) {
    if (a[i] > r) r = a[i]
  }
  return r
}

V.any = function (a) {
  let len = a.length
  for (let i=0; i<len; i++) {
    if (a[i]) return true
  }
  return false
}

V.all = function (a) {
  let len = a.length
  for (let i=0; i<len; i++) {
    if (!a[i]) return false
  }
  return true
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

V.norminf = function (a) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r = Math.max(r, Math.abs(a[i]))
  }
  return r
}

// norminf: ['accum = max(accum,abs(xi));','var accum = 0, max = Math.max, abs = Math.abs;'],

V.mean = function(a) {
  return V.sum(a)/a.length
}

V.sd = function (a) {
  let m = V.mean(a)
  let diff = V.subc(a, m)
  let d2 = V.powc(diff, 2)
  return Math.sqrt(V.sum(d2)/(a.length-1))
}

const EPSILON = 0.00000001

V.hist = function (a, from = Math.floor(V.min(a)), to=Math.ceil(V.max(a)), step = 1) {
  // from = (from==null) ?  : from
  // to   = (to==null) ?  : to
  var n = Math.ceil((to - from + EPSILON) / step)
  var xc = V.range(from + step / 2.0, to, step)
  var bins = V.array(n, 0)
  let len = a.length
  for (let i=0; i<len; i++) {
    var slot = Math.floor((a[i] - from) / step)
    if (slot >= 0 && slot < n) {
      bins[slot]++
    }
  }
  return {type: 'histogram', xc: xc, bins: bins, from: from, to: to, step: step}
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
  min() { let a=this; return V.min(a.v) }
  max() { let a=this; return V.max(a.v) }
  sum() { let a=this; return V.sum(a.v) }
  norm() { let a=this; return V.norm(a.v)  }
  mean() { let a=this; return V.mean(a.v) }
  sd() { let a=this; return V.sd(a.v) }
  toString() { return this.v.toString() }
  clone(v) { return new Vector(v||this.v) }
  hist(from, to, step) { let a = this; return V.hist(a.v, from, to, step) }
  get length() { return this.v.length }
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
