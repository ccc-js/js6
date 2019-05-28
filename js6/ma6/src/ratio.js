const F = require('./function')
const R = module.exports = {}

R.neg = function (x) { return {a:-x.a, b:x.b} }
R.inv = function (x) { return {a:x.b, b:x.a} }
R.add = function (x,y) { return {a:x.a*y.b+x.b*y.a, b:x.b*y.b} }
R.sub = function (x,y) { return {a:x.a*y.b-x.b*y.a, b:x.b*y.b} }
R.mul = function (x,y) { return {a:x.a*y.a, b:x.b*y.b} }
R.div = function (x,y) { return R.mul(x, R.inv(y)) }
R.str = function (x) { return x.a+'/'+x.b }

R.reduce = function (x) {
  var c = F.gcd(x.a, x.b)
  return {a:x.a/c, b:x.b/c}
}

R.ratio = function (s) {
  var m = s.match(/^(\d+)(\/(\d+))?$/);
  if (m == null) return
  var a = parseInt(m[1]);
  var b = typeof m[3]==='undefined'?1:parseInt(m[3]);
  return {a, b}
}

R.number = function (x) {
  return x.a/x.b
}

class Ratio {
  constructor(x) {
    if (typeof x === 'string') return new Ratio(R.ratio(x))
    this.a = x.a; this.b = x.b
  }
  neg() { return new Ratio(R.neg(this)) }
  inv() { return new Ratio(R.inv(this)) }
  add(y) { return new Ratio(R.add(this, y)) }
  sub(y) { return new Ratio(R.sub(this, y)) }
  mul(y) { return new Ratio(R.mul(this, y)) }
	div(y) { return new Ratio(R.div(this, y)) }
  clone() { return new Ratio(this) }
  toString() { return R.str(this) }
  reduce() { return new Ratio(R.reduce(this)) }
}

R.Ratio = Ratio
