const F = module.exports = {}

F.neg = function (fx) {
  return function (...arg) { return -1 * fx(...arg) }
}

F.inv = function (fx) {
  return function (...arg) { return 1 / fx(...arg) }
}

F.add = function (fx, fy) {
  return function(...arg) { return fx(...arg)+fy(...arg) }
}

F.sub = function (fx, fy) {
  return function(...arg) { return fx(...arg)-fy(...arg) }
}

F.mul = function (fx, fy) {
  return function(...arg) { return fx(...arg)*fy(...arg) }
}

F.div = function (fx, fy) {
  return function(...arg) { return fx(...arg)/fy(...arg) }
}

F.compose = function (fx, fy) {
  return function(...arg) { return fx(fy(...arg)) }
}

F.call = function (f, ...arg) { return f(...arg) }

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

F.factorial = function (n) {
  let r = 1
  for (let i=2; i<=n; i++) {
    r *= i
  }
  return r
}
