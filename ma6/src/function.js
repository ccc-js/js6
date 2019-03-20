const F = module.exports = {}

F.grad = function (f, v, h=0.01) {
  let len = v.length, fv = f(v)
  let v2 = v.slce(0)
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    let t = v2[i]
    v2[i] += h
    g[i] = (f(v2) - fv) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
    v2[i] = t
  }
  return new Vector(g)
}

F.neg = function (fx) {
  return function (v) { return -1 * fx(v) }
}

F.inv = function (fx) {
  return function (v) { return 1 / fx(v) }
}

F.add = function (fx, fy) {
  return function (v) { return fx(v).add(fy(v)) }
}

F.sub = function (fx, fy) {
  return function (v) { return fx(v).sub(fy(v)) }
}

F.mul = function (fx, fy) {
  return function (v) { return fx(v).mul(fy(v)) }
}

F.div = function (fx, fy) {
  return function (v) { return fx(v).div(fy(v)) }
}

F.compose = function (fx, fy) {
  return function (v) { return fx(fy(v)) }
}

F.eval = function (f, x) { return f(x) }

// f=(x,y)=>x*y+x*x;
// f0=fa(f); f0([x,y]);
F.fa = function (f) {
  return function (x) { return f.apply(null, x) }
}

// relation
F.eq = function (a, b) {
  return (typeof a === typeof b) && a.toString() === b.toString()
}

F.neq = function (a, b) { return !F.eq(a, b) }
F.leq = function (a, b) { return a <= b }
F.geq = function (a, b) { return a >= b }
F.lt = function (a, b) { return a < b }
F.gt = function (a, b) { return a > b }
F.near = function (a, b) { return Math.abs(a - b) < 0.0001 }

// =========== Integer ====================
F.isPrime = function (n) {
  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return n % 1 === 0
}

F.gcd = function (a, b) {
  if (!b) return a
  return F.gcd(b, a % b)
}

F.lcm = function (a, b) {
  return (a * b) / F.gcd(a, b)
}
