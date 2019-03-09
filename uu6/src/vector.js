const V = module.exports = {}
const {amap2} = require('./array')

V.add = function (a,b) {
  return amap2(a, b, (x,y)=>(x+y))
}

V.sub = function (a,b) {
  return amap2(a, b, (x,y)=>(x-y))
}

V.mul = function (a,b) {
  return amap2(a, b, (x,y)=>(x*y))
}

V.div = function (a,b) {
  return amap2(a, b, (x,y)=>(x/y))
}

V.mod = function (a,b) {
  return amap2(a, b, (x,y)=>(x%y))
}

V.dot = function (a,b) {
  let len = a.length, r = 0
  for (let i=0; i<len; i++) {
    r += a[i] * b[i]
  }
  return r
}

// Constant Operation
V.cmul = function (c, a) {
  return a.map((x)=>x*c)
}

V.cadd = function (c, a) {
  return a.map((x)=>x+c)
}

// Uniary Operation
V.neg = function (a) {
  return a.map((x)=>-x)
}

V.norm = function(a) {
  let len = a.length, r = 0
  for (let i=0; i<len; i++) {
    r += a[i] * a[i]
  }
  return Math.sqrt(r)
}
