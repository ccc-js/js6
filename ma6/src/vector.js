const uu6 = require('../../uu6')
const V = module.exports = {}

V.array = uu6.array

V.add = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] + b[i]
  }
  return r
}

V.sub = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] - b[i]
  }
  return r
}

V.mul = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] * b[i]
  }
  return r
}

V.div = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] / b[i]
  }
  return r
}

V.mod = function (a, b) {
  let len = a.length
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = a[i] % b[i]
  }
  return r
}

// Constant Operation
V.mulc = function (a, c) {
  if (typeof a === 'number') [a,c]=[c,a]
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = a[i] *c
  }
  return r
}

V.divc = function (a,c) { return V.mulc(a, 1/c) }

V.addc = function (a, c) {
  if (typeof a === 'number') [a,c]=[c,a]
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = a[i] + c
  }
  return r
}

V.subc = function (a,c) { return V.addc(a, -c) }

V.powc = function (a, c) {
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = Math.pow(a[i], c)
  }
  return r
}

// Uniary Operation
V.neg = function (a) {
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = -a[i]
  }
  return r
}

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
  static random(n, min, max) { return new Vector(V.random(n, min, max)) }
  static range(begin, end, step=1) { return new Vector(V.range(begin, end, step)) }
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
  size() { return this.v.length }
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
