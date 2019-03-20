(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./src/ai6')
},{"./src/ai6":2}],2:[function(require,module,exports){
const ai6 = module.exports = {
  gd: require('./gradientDescendent')
}

ai6.gradientDescendent = ai6.gd

},{"./gradientDescendent":3}],3:[function(require,module,exports){
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, v0, args={}) {
  let args2 = uu6.defaults(args, {call:ma6.Point.call, grad:ma6.Point.grad, step:0.01, gap:0.0001, debug:true})
  let {call, grad, step, gap, debug} = args2
  let p = new ma6.Point(v0)
  while (true) {
    let e = call(f, p)
    if (debug) console.log('p=', p, 'f(p)=', e) // .toString()
    let g = grad(f, p) // 計算梯度 gp
    if (debug) console.log('  g=', g) // .toString()
    let d = g.mulc(-1*step)
    if (g.norm() < gap) break
    p =  p.add(d)
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent

/*
    //console.log('d=', d)
    let p2 = p.add(d)
    let e2 = call(f, p2)
    console.log('e=', e, 'e2=', e2, 'p2=', p2)
    //process.exit(1)
    // if (e2 > e - gap) break
*/
},{"../../ma6":7,"../../uu6":29}],4:[function(require,module,exports){
module.exports = {
  MapVector: require('../ma6/src/MapVector'),
}

},{"../ma6/src/MapVector":8}],5:[function(require,module,exports){
js6 = require('./index')

},{"./index":6}],6:[function(require,module,exports){
module.exports = {
  ai6: require('./ai6'),
  ds6: require('./ds6'),
  ma6: require('./ma6'),
  nn6: require('./nn6'),
  se6: require('./se6'),
  sp6: require('./sp6'),
  uu6: require('./uu6'),
}

},{"./ai6":1,"./ds6":4,"./ma6":7,"./nn6":18,"./se6":25,"./sp6":28,"./uu6":29}],7:[function(require,module,exports){
module.exports = require('./src/ma6')

},{"./src/ma6":11}],8:[function(require,module,exports){
const uu6 = require('../../uu6')
const V = require('./vector')

module.exports = class MapVector extends V.Vector {
  constructor(o={}) {
    super(null)
    this.o = {...o}
  }

  clone () {
    return new MapVector({...this.o})
  }

  add (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  sub (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  dot (v2) {
    let o1=this.o, o2=v2.o, r=0
    for (let k in o1) {
      r += o1[k] * o2[k]
    }
    return r
  }
  
  mul (c) {
    let v = this.clone(), o0=v.o, o1=this.o
    for (let k in o1) {
      o0[k] = o1[k] * c
    }
    return v
  }
  
  neg () {
    return this.mul(-1)
  }

  sum () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k]
    }
    return r
  }

  norm () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k] * o[k]
    }
    return Math.sqrt(r)
  }

  json (n=4) {
    return uu6.json(this.p, null, n)
  }
}

},{"../../uu6":29,"./vector":17}],9:[function(require,module,exports){
module.exports = {
  Pi: Math.PI,
  E: Math.E,
  Epsilon: 0.000001
}
},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
const uu6 = require('../../uu6')

const ma6 = module.exports = {
  P: require('./prob'),
  V: require('./vector'),
  T: require('./tensor'),
  M: require('./matrix'),
  S: require('./stat'),
  F: require('./function'),
  C: require('./constant'),
  // PointFunction: require('./PointFunction'),
}

uu6.mixin(ma6, ma6.P, ma6.V, ma6.T, ma6.M, ma6.S, ma6.F, ma6.C, 
  require('./point')
)

},{"../../uu6":29,"./constant":9,"./function":10,"./matrix":12,"./point":13,"./prob":14,"./stat":15,"./tensor":16,"./vector":17}],12:[function(require,module,exports){
const M = module.exports = {}

M.tr = M.transpose = function (m) {
  var r = []
  var rows = m.length
  var cols = m[0].length
  for (var j = 0; j < cols; j++) {
    var rj = r[j] = []
    for (var i = 0; i < rows; i++) {
      rj[i] = m[i][j]
    }
  }
  return r
}

M.dot = function (a, b, isComplex = false) {
  var arows = a.length
  var bcols = b[0].length
  var r = []
  var bt = M.tr(b)
  for (var i = 0; i < arows; i++) {
    var ri = r[i] = []
    for (var j = 0; j < bcols; j++) {
      ri.push(j6.V.dot(a[i], bt[j], isComplex))
    }
  }
  return r
}

M.diag = function (v) {
  var rows = v.length
  var r = M.new(rows, rows)
  for (var i = 0; i < rows; i++) {
    r[i][i] = v[i]
  }
  return r
}

M.identity = function (n) {
  return M.diag(j6.T.repeat([n], () => 1))
}

M.inv = function (m0) {
  var s = j6.T.dim(m0), abs = Math.abs, m = s[0], n = s[1]
  var A = j6.clone(m0), Ai, Aj
  var I = M.identity(m), Ii, Ij
  var i, j, k, x
  for (j = 0; j < n; ++j) {
    var i0 = -1
    var v0 = -1
    for (i = j; i !== m; ++i) {
      k = abs(A[i][j])
      if (k > v0) { i0 = i; v0 = k }
    }
    Aj = A[i0]; A[i0] = A[j]; A[j] = Aj
    Ij = I[i0]; I[i0] = I[j]; I[j] = Ij
    x = Aj[j]
    for (k = j; k !== n; ++k) Aj[k] /= x
    for (k = n - 1; k !== -1; --k) Ij[k] /= x
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i]
        Ii = I[i]
        x = Ai[j]
        for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x
        for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x }
        if (k === 0) Ii[0] -= Ij[0] * x
      }
    }
  }
  return I
}

M.det = function (x) {
  var s = j6.dim(x)
  if (s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices') }
  var n = s[0], ret = 1, i, j, k, A = j6.clone(x), Aj, Ai, alpha, temp, k1
  for (j = 0; j < n - 1; j++) {
    k = j
    for (i = j + 1; i < n; i++) { if (Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i } }
    if (k !== j) {
      temp = A[k]; A[k] = A[j]; A[j] = temp
      ret *= -1
    }
    Aj = A[j]
    for (i = j + 1; i < n; i++) {
      Ai = A[i]
      alpha = Ai[j] / Aj[j]
      for (k = j + 1; k < n - 1; k += 2) {
        k1 = k + 1
        Ai[k] -= Aj[k] * alpha
        Ai[k1] -= Aj[k1] * alpha
      }
      if (k !== n) { Ai[k] -= Aj[k] * alpha }
    }
    if (Aj[j] === 0) { return 0 }
    ret *= Aj[j]
  }
  return ret * A[j][j]
}
},{}],13:[function(require,module,exports){
const P = module.exports = {}

const V = require('./vector')

class Point extends V.Vector {
  constructor(o) { super(o) }
  static call(f, p) {
    return f(p.v)
  }
  static grad(f, p, h=0.01) {
    let len = p.size(), fp = f(p.v)
    let p2= p.clone(), v2 = p2.v
    let g = new Array(p.size())
    for (let i=0; i<len; i++) {
      let t = v2[i]
      v2[i] += h
      g[i] = (f(p2.v) - fp) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      v2[i] = t
    }
    return new V.Vector(g)
  }
  static distance(x, y) {
    return x.sub(y).norm()
  }
  // be(d(x,y)>=0);
  // be(d(x,x)==0);
  // be(d(x,y)==d(y,x));
  distance(y) {
    return Point.distance(this, y)
  }

  clone(v) { return new Point(v||this.v) }
}

P.Point = Point

},{"./vector":17}],14:[function(require,module,exports){
const P = module.exports = {}
const uu6 = require('../../uu6')

// var J = require('jStat').jStat
// var ncall = P.ncall

// ========== 離散分佈的 r, q 函數 ============
P.qcdf = function (cdf, q, N, p) {
  for (var i = 0; i <= N; i++) {
    if (cdf(i, N, p) > q) return i
  }
  return N
}

P.rcdf = function (cdf, n, N, p) {
  var a = []
  for (var i = 0; i < n; i++) {
    var q = Math.random()
    a.push(cdf(q, N, p))
  }
  return a
}

P.EPSILON = 0.0000000001
// 均等分布 : Uniform Distribution(a,b)    1/(b-a)
P.dunif = function (x, a = 0, b = 1) { return (x >= a && x <= b) ? 1 / (b - a) : 0 }
P.punif = function (x, a = 0, b = 1) { return (x >= b) ? 1 : (x <= a) ? 0 : (x - a) / (b - a) }
P.qunif = function (p, a = 0, b = 1) { return (p >= 1) ? b : (p <= 0) ? a : a + (p * (b - a)) }
P.runif1 = function (a = 0, b = 1) { return P.random(a, b) }
P.runif = function (n, a = 0, b = 1) { return ncall(n, P, 'random', a, b) }
/*
P.dunif=(x,a=0,b=1)=>J.uniform.pdf(x,a,b);
P.punif=(q,a=0,b=1)=>J.uniform.cdf(q,a,b);
P.qunif=(p,a=0,b=1)=>J.uniform.inv(p,a,b);
P.runif=(n,a=0,b=1)=>ncall(n, J.uniform, 'sample', a, b);
*/
// 常態分布 : jStat.normal( mean, sd )
P.dnorm = (x, mean = 0, sd = 1) => J.normal.pdf(x, mean, sd)
P.pnorm = (q, mean = 0, sd = 1) => J.normal.cdf(q, mean, sd)
P.qnorm = (p, mean = 0, sd = 1) => J.normal.inv(p, mean, sd)
P.rnorm1 = function () { // generate random guassian distribution number. (mean : 0, standard deviation : 1)
  var v1, v2, s
  do {
    v1 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    v2 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    s = (v1 * v1) + (v2 * v2)
  } while (s >= 1 || s === 0)

  s = Math.sqrt((-2 * Math.log(s)) / s)
  return v1 * s
}

P.rnorm = (n, mean = 0, sd = 1) => ncall(n, J.normal, 'sample', mean, sd)
// F 分布 : jStat.centralF( df1, df2 )
P.df = (x, df1, df2) => J.centralF.pdf(x, df1, df2)
P.pf = (q, df1, df2) => J.centralF.cdf(q, df1, df2)
P.qf = (p, df1, df2) => J.centralF.inv(p, df1, df2)
P.rf = (n, df1, df2) => ncall(n, J.centralF, 'sample', df1, df2)
// T 分布 : jStat.studentt( dof )
P.dt = (x, dof) => J.studentt.pdf(x, dof)
P.pt = (q, dof) => J.studentt.cdf(q, dof)
P.qt = (p, dof) => J.studentt.inv(p, dof)
P.rt = (n, dof) => ncall(n, J.studentt, 'sample', dof)
// Beta 分布 : jStat.beta( alpha, beta )
P.dbeta = (x, alpha, beta) => J.beta.pdf(x, alpha, beta)
P.pbeta = (q, alpha, beta) => J.beta.cdf(q, alpha, beta)
P.qbeta = (p, alpha, beta) => J.beta.inv(p, alpha, beta)
P.rbeta = (n, alpha, beta) => ncalls(n, J.beta, 'sample', alpha, beta)
// 柯西分布 : jStat.cauchy( local, scale )
P.dcauchy = (x, local, scale) => J.cauchy.pdf(x, local, scale)
P.pcauchy = (q, local, scale) => J.cauchy.cdf(q, local, scale)
P.qcauchy = (p, local, scale) => J.cauchy.inv(q, local, scale)
P.rcauchy = (n, local, scale) => ncall(n, J.cauchy, 'sample', local, scale)
// chisquare 分布 : jStat.chisquare( dof )
P.dchisq = (x, dof) => J.chisquare.pdf(x, dof)
P.pchisq = (q, dof) => J.chisquare.cdf(q, dof)
P.qchisq = (p, dof) => J.chisquare.inv(p, dof)
P.rchisq = (n, dof) => ncall(n, J.chisquare, 'sample', dof)
// 指數分布 : Exponential Distribution(b)  1/b e^{-x/b}
P.dexp = function (x, rate) { return rate * Math.exp(-rate * x) }
P.pexp = function (x, rate) { return x < 0 ? 0 : 1 - Math.exp(-rate * x) }
P.qexp = function (p, rate) { return -Math.log(1 - p) / rate }
P.rexp1 = function (rate) { return P.qexp(P.random(0, 1), rate) }
P.rexp = function (n, rate) { return ncall(n, P, 'rexp1', rate) }
/*
P.dexp=(x,rate)=>J.exponential.pdf(x,rate);
P.pexp=(q,rate)=>J.exponential.cdf(q,rate);
P.qexp=(p,rate)=>J.exponential.inv(p,rate);
P.rexp=(n,rate)=>ncall(n, J.exponential, 'sample', rate);
*/
// Gamma 分布 : jStat.gamma( shape, scale )
P.dgamma = (x, shape, scale) => J.gamma.pdf(x, shape, scale)
P.pgamma = (q, shape, scale) => J.gamma.cdf(q, shape, scale)
P.qgamma = (p, shape, scale) => J.gamma.inv(p, shape, scale)
P.rgamma = (n, shape, scale) => ncall(n, J.gamma, 'sample', shape, scale)
// 反 Gamma 分布 : jStat.invgamma( shape, scale )
P.rinvgamma = (n, shape, scale) => ncall(n, J.invgamma, 'sample', shape, scale)
P.dinvgamma = (x, shape, scale) => J.invgamma.pdf(x, shape, scale)
P.pinvgamma = (q, shape, scale) => J.invgamma.cdf(q, shape, scale)
P.qinvgamma = (p, shape, scale) => J.invgamma.inv(p, shape, scale)
// 對數常態分布 : jStat.lognormal( mu, sigma )
P.dlognormal = (n, mu, sigma) => J.lognormal.pdf(x, sigma)
P.plognormal = (n, mu, sigma) => J.lognormal.cdf(q, sigma)
P.qlognormal = (n, mu, sigma) => J.lognormal.inv(p, sigma)
P.rlognormal = (n, mu, sigma) => ncall(n, J.dlognormal, 'sample', mu, sigma)
// Pareto 分布 : jStat.pareto( scale, shape )
P.dpareto = (n, scale, shape) => J.pareto.pdf(x, scale, shape)
P.ppareto = (n, scale, shape) => J.pareto.cdf(q, scale, shape)
P.qpareto = (n, scale, shape) => J.pareto.inv(p, scale, shape)
P.rpareto = (n, scale, shape) => ncall(n, J.pareto, 'sample', scale, shape)
// Weibull 分布 jStat.weibull(scale, shape)
P.dweibull = (n, scale, shape) => J.weibull.pdf(x, scale, shape)
P.pweibull = (n, scale, shape) => J.weibull.cdf(q, scale, shape)
P.qweibull = (n, scale, shape) => J.weibull.inv(p, scale, shape)
P.rweibull = (n, scale, shape) => ncall(n, J.weibull, 'sample', scale, shape)
// 三角分布 : jStat.triangular(a, b, c)
P.dtriangular = (n, a, b, c) => J.triangular.pdf(x, a, b, c)
P.ptriangular = (n, a, b, c) => J.triangular.cdf(q, a, b, c)
P.qtriangular = (n, a, b, c) => J.triangular.inv(p, a, b, c)
P.rtriangular = (n, a, b, c) => ncall(n, J.triangular, 'sample', a, b, c)
// 類似 Beta 分布，但計算更簡單 : jStat.kumaraswamy(alpha, beta)
P.dkumaraswamy = (n, alpha, beta) => J.kumaraswamy.pdf(x, alpha, beta)
P.pkumaraswamy = (n, alpha, beta) => J.kumaraswamy.cdf(q, alpha, beta)
P.qkumaraswamy = (n, alpha, beta) => J.kumaraswamy.inv(p, alpha, beta)
P.rkumaraswamy = (n, alpha, beta) => ncalls(n, J.kumaraswamy, 'sample', alpha, beta)

// ========== 離散分佈的 r, q 函數 ============
// 二項分布 : jStat.binomial(n, p0)
P.dbinom = (x, size, prob) => J.binomial.pdf(x, size, prob)
P.pbinom = (q, size, prob) => J.binomial.cdf(q, size, prob)
P.qbinom = (p, size, prob) => P.qcdf(P.pbinom, p, size, prob)
P.rbinom = (n, size, prob) => P.rcdf(P.qbinom, n, size, prob)
// 負二項分布 : jStat.negbin(r, p)
P.dnbinom = (x, size, prob) => J.negbin.pdf(x, size, prob)
P.pnbinom = (q, size, prob) => J.negbin.cdf(q, size, prob)
P.qnbinom = (p, size, prob) => P.qcdf(P.pnbinom, p, size, prob)
P.rnbinom = (n, size, prob) => P.rcdf(P.qnbinom, n, size, prob)
// 超幾何分布 : jStat.hypgeom(N, m, n)
P.dhyper = (x, m, n, k) => J.hypgeom.pdf(k, m, n, k)
P.phyper = (q, m, n, k) => J.hypgeom.cdf(q, m, n, k)
P.qhyper = (p, m, n, k) => P.qcdf(P.phyper, p, m, n, k)
P.rhyper = (nn, m, n, k) => P.rcdf(P.qhyper, nn, m, n, k)
// 布瓦松分布 : jStat.poisson(l)
P.dpois = (x, lambda) => J.poisson.pdf(x, lambda)
P.ppois = (q, lambda) => J.poisson.cdf(q, lambda)
P.qpois = (p, lambda) => P.qcdf(P.ppois, p, lambda)
P.rpois = (n, lambda) => P.rcdf(P.qpois, n, lambda)
},{"../../uu6":29}],15:[function(require,module,exports){
const S = module.exports = {}

S.random = function (a = 0, b = 1) {
  let r = a + (Math.random() * (b - a))
  return r
}

S.randomInt = function (a, b) {
  let r = S.random(a, b + 0.999999999)
  return Math.floor(r)
}

S.sample = function (space, probs) {
  if (probs == null) return space[S.randomInt(0, space.length - 1)]
  let p = S.random(0, 1)
  let sump = 0
  for (let i = 0; i < space.length; i++) {
    sump += probs[i]
    if (p <= sump) return space[i]
  }
  throw new Error('S.sample fail!')
}

S.samples = function (space, size, arg) {
  arg = S._.defaults(arg, {replace: true})
  if (arg.replace) {
    var results = []
    for (let i = 0; i < size; i++) {
      results.push(S.sample(space, arg.prob))
    }
    return results
// return _.times(size, ()=>_.sample(space));
  } else {
    if (space.length < size) throw Error('statistics.samples() : size > space.length')
    return S._.sampleSize(space, size)
  }
}

S.normalize = function (a) {
  var sum = S.T.sum(a)
  return a.map(function (x) { return x / sum })
}

S.max = S.T.max
S.min = S.T.min
S.sum = S.T.sum
S.product = S.T.product

// graphics
S.curve = function (f, from = -10, to = 10, step = 0.1) {
  var x = S.steps(from, to, step)
  var y = x.map1(f)
  return {type: 'curve', x: x, y: y}
}

S.hist = function (a, from, to, step = 1) {
  from = from || a.min()
  to = to || a.max()
  var n = Math.ceil((to - from + S.EPSILON) / step)
  var xc = S.steps(from + step / 2.0, to, step)
  var bins = S.V.new(n, 0)
  for (var i in a) {
    var slot = Math.floor((a[i] - from) / step)
    if (slot >= 0 && slot < n) {
      bins[slot]++
    }
  }
  return {type: 'histogram', xc: xc, bins: bins, from: from, to: to, step: step}
}

S.ihist = function (a) {
  return S.hist(a, a.min() - 0.5, a.max() + 0.5, 1)
}
},{}],16:[function(require,module,exports){
const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')

T.size = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx, lo) {
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.sliceNdarray = function (v, shape, lo, hi) {
  let dim = shape.length
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]
  if (dim === 1) {
    let rv = new Array(wi2)
    for (let ri = 0, i=lo[0]; i<hi[0]; ri++, i++) rv[ri++] = v[i]
    return rv
  }
  if (dim === 2) {
    let rv = new Array(wi2)
    for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
      let rvi = rv[ri] = new Array(wj2)
      for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
        rvi[rj] = v[i*wj+j]
      }
    }
    return rv
  }
  if (dim === 3) {
    let rv = new Array(wi2)
    for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
      let rvi = rv[ri] = new Array(wj2)
      for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
        let rvj = rv[ri][rj] = new Array(wk2)
        for (let rk=0, k=lo[2]; k<hi[2]; rk++, k++) {
          rvj[rk] = v[(i*wj+j)*wk+k]
        }
      }
    }
    return rv
  }
  throw Error('sliceNdarray():dim > 3')
}

T.tensor2ndarray = function (v, shape, lo, hi) {
  return T.sliceNdarray(v, shape, V.array(shape.length), shape)
} 

T.ndarray2tensor = function (nd) {
  let t = null
  if (!uu6.is(nd, 'array')) {
    t = { v: nd, shape:[] }
    return t
  }
  let rows = nd.length
  uu6.be(rows > 0)
  let v = [], cols = nd[0].length
  for (let i=0; i<rows; i++) {
    uu6.be(nd[i].length === cols)
    t = T.ndarray2tensor(nd[i])
    v = v.concat(t.v)
  }
  t.shape.unshift(nd.length)
  return {v: v, shape: t.shape }
}

class Tensor extends V.Vector {
  constructor(v, shape) {
    super()
    if (shape == null) { // from ndarray
      let nd = v
      console.log('RealTensor:nd=', nd)
      let t = T.ndarray2tensor(nd)
      this.v = t.v
      this.shape = t.shape
    } else {
      this.v = v
      this.shape = shape
      uu6.be(T.size(shape) === v.length)
    }
  }
  get(...idx) {
    return this.v[T.offset(this.shape, idx)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    this.v[T.offset(this.shape, idx)] = o
  }
  slice(v, shape, lo, hi) {

    this.lo = lo
    this.hi = hi
  }
  reshape(shape) {
    uu6.be(uu6.is(shape, 'array') && T.size(shape) === this.v.length)
    this.shape = shape
    return this
  }
  ndarray() {
    return T.tensor2ndarray(this.v, this.shape)
  }
  toString() {
    return uu6.json({shape, v})
  }
}

T.Tensor = Tensor

T.tensor = function (v, shape) {
  return new Tensor(v, shape)
}

/*
T.RealTensor = RealTensor
class SliceTensor extends Tensor {
  constructor(v, shape, lo, hi) {
    super(v, shape)
    this._shape = shape
    this.lo = lo
    this.hi = hi
  }
  get shape() { return V.sub(this.hi, this.lo) }
  set shape(v) { throw Error('SliceTensor cannot be reshaped!') }
  get(...idx) {
    let idx2 = V.add(idx, lo)
    return this.v[T.offset(this.shape, idx2)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    let idx2 = V.add(idx, lo)
    this.v[T.offset(this.shape, idx2)] = o
  }
  reshape(shape) { throw Error('SliceTensor cannot be reshaped!')}
}

T.SliceTensor = SliceTensor
*/


/*
class Tensor extends V.Vector {
  constructor(v, shape) {
    super([])
  }
}
*/ 
},{"../../uu6":29,"./vector":17}],17:[function(require,module,exports){
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

},{"../../uu6":29}],18:[function(require,module,exports){
module.exports = require('./src/nn6')
},{"./src/nn6":23}],19:[function(require,module,exports){
module.exports = G = {}

class Gate {}

G.Gate1 = class Gate1 extends Gate {
  constructor(o, x, f, gfx) {
    super()
    this.p = {o:o, x:x, f:f, gfx:gfx}
  }

  forward() {
    let {o, x, f} = this.p
    o.v = f(x.v)
    o.g = x.g = 0
  }

  backward() {
    let {o,x,gfx} = this.p
    x.g += gfx(x.v) * o.g
  }
}

G.Gate2 = class Gate2 extends Gate {
  constructor(o, x, y, f, gfx, gfy) {
    super()
    this.p = {o:o, x:x, y:y, f:f, gfx:gfx, gfy:gfy||gfx}
  }

  forward() {
    let {o, x, y, f} = this.p
    o.v = f(x.v, y.v)
    o.g = x.g = y.g = 0
  }

  backward() {
    let {o,x,y,gfx,gfy} = this.p
    x.g += gfx(x.v, y.v) * o.g
    y.g += gfy(x.v, y.v) * o.g
  }
}

},{}],20:[function(require,module,exports){
const N = require('./node')
const G = require('./gate')
const F = require('./func')
const ma6 = require('../../ma6')

module.exports = class Net {
  static call(net, p) {
    for (let i in p.v) {
      net.vars[i].v = p.v[i]
    }
    let o = net.forward()
    return o.v
  }

  static grad(net, p) {
    let g = new ma6.Vector(p.size())
    Net.call(net, p)
    net.backward()
    for (let i in p.v) {
      g.v[i] = net.vars[i].g
    }
    return g
  }

  constructor () {
    this.gates = []
    this.vars = []
    this.watchNodes = []
  }

  variable (v, g) {
    let node = new N.Variable(v, g)
    this.vars.push(node)
    return node
  }
  
  constant (v) { return new N.Constant(v) }

  op1 (x, f, gfx) {
    let o = new N.Variable()
    let g = new G.Gate1(o, x, f, gfx)
    this.gates.push(g)
    this.o = o
    return o
  }

  op2 (x, y, f, gfx, gfy) {
    let o = new N.Variable()
    let g = new G.Gate2(o, x, y, f, gfx, gfy)
    this.gates.push(g)
    this.o = o
    return o
  }

  // op1
  neg (x) { return this.op1(x, (x)=>-x, (x)=>-1) }
  rev (x) { return this.op1(x, (x)=>1/x, (x)=>-1/(x*x)) }
  exp (x) { return this.op1(x, F.exp, F.dexp) }
  relu (x, leaky=0) { return this.op1(x, (x)=>F.relu(x, leaky), (x)=>F.drelu(x, leaky)) }
  sigmoid (x) { return this.op1(x, F.sigmoid, F.dsigmoid) }
  tanh (x) { return this.op1(x, F.tanh, F.dtanh) }

  // op2
  add (x, y) { return this.op2(x, y, (x,y)=>x+y, (x,y)=>1) }
  sub (x, y) { return this.op2(x, y, (x,y)=>x-y, (x,y)=>1, (x,y)=>-1) }
  mul (x, y) { return this.op2(x, y, (x,y)=>x*y, (x,y)=>y, (x,y)=>x) }
  div (x, y) { return this.op2(x, y, (x,y)=>x/y, (x,y)=>1/y, (x,y)=>-x/(y*y)) }
  pow (x, y) { return this.op2(x, y, F.pow, F.dpowx, F.dpowy) }

  forward() { // 正向傳遞計算結果
    for (let gate of this.gates) {
      gate.forward()
    }
    return this.o
  }

  backward() { // 反向傳遞計算梯度
    this.o.g = 1 // 設定輸出節點 o 的梯度為 1
    for (let i=this.gates.length-1; i>=0; i--) { // 反向傳遞計算每個節點 Node 的梯度 g
      let gate = this.gates[i]
      gate.backward()
    }
  }

  watch (nodes) {
    this.watchNodes = nodes
  }

  dump() {
    return this.watchNodes
  }
}




},{"../../ma6":7,"./func":21,"./gate":22,"./node":24}],21:[function(require,module,exports){
var F = module.exports = {}

F.near = function (a, b, diff=0.000001) {
  return Math.abs(a - b) < diff
}

F.neg = function (x) {
  return -x
}

F.dneg = function (x) {
  return -1
}

F.rev = function (x) {
  return 1.0 / x
}

F.drev = function (x) {
  return -1 / (x*x)
}

F.exp = function (x) {
  return Math.exp(x)
}

F.dexp = function (x) {
  return Math.exp(x)
}

// 問題是，當所有的輸出值都小於 0，就會都被 Relu 截掉，於是變成 [0,0,0....]
// 所以 relu 通常要加上 leaky 成為 leakyRelu
// 即使小於 0 也會給一個很小的梯度。
F.relu = function (x, leaky=0) {
  return x > 0 ? x : leaky * x
}

F.drelu = function (x, leaky=0) {
  return x > 0 ? 1 : leaky
}

F.sigmoid = function (x) {
  return 1 / (1 + Math.exp(-x))
}

F.dsigmoid = function (x) {
  var s = F.sigmoid(x)
  return s * (1 - s)
}

F.tanh = function (x) {
  // return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
  return Math.tanh(x)
}

F.dtanh = function (x) {
  return 1.0 - x*x
}

F.pow = function (x, y) {
  return Math.pow(x, y)
}

F.dpowx = function (x, y) {
  return y * Math.pow(x, y-1)
}

F.dpowy = function (x, y) {
  return Math.pow(x, y) * Math.log(x)
}

F.add = function (x, y) {
  return x + y
}

F.dadd = function (x, y) {
  return 1
}

F.sub = function (x, y) {
  return x - y
}

F.dsubx = function (x, y) {
  return 1
}

F.dsuby = function (x, y) {
  return -1
}

F.mul = function (x, y) {
  return x * y
}

F.dmul = function (x, y) {
  return y
}

F.div = function (x, y) {
  return x / y
}

F.ddivx = function (x, y) {
  return 1 / y
}

F.ddivy = function (x, y) {
  return -x / (y * y)
}

F.max = function (list) {
  let r = Number.MIN_VALUE
  for (let x of list) {
    if (x > r) r = x
  }
  return r
}

// 這版的 softmax 會有 overflow, underflow 的危險 (只要總和超過幾百，或者小於幾百，就會爆了)，改一下！
// 參考： http://freemind.pluskid.org/machine-learning/softmax-vs-softmax-loss-numerical-stability/
F.softmax = function (list) {
  let sum = 0, r = [], e = []
  let max = F.max(list)
  for (let i=0; i<list.length; i++) {
    e[i] = Math.exp(list[i]-max)
    sum += e[i]
  }
  for (let i=0; i<list.length; i++) {
    r.push(e[i]/sum)
  }
  // console.log('Softmax: list=%j r=%j', list, r)
  return r
}


},{}],22:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],23:[function(require,module,exports){
module.exports = {
  Node: require('./node'),
  Gate: require('./Gate'),
  Net: require('./Net'),
  // FNet: require('./FNet'),
}

},{"./Gate":19,"./Net":20,"./node":24}],24:[function(require,module,exports){
class Node {}

class Constant extends Node {
  constructor(v = 0) {
    super()
    this.val = v
  }
  get v() { return this.val }
  set v(c) { } // 常數不能事後設定值
  get g() { return 0 } // 常數的梯度 = 0
  set g(c) { } // 常數不能設定梯度
}

class Variable extends Node {
  constructor(v = 0, g = 0) {
    super()
    this.v = v // 輸出值 (f(x))
    this.g = g // 梯度值 (偏微分)
  }
}

module.exports = {
  Constant, Variable
}
},{}],25:[function(require,module,exports){
module.exports = require('./src/se6')

},{"./src/se6":27}],26:[function(require,module,exports){
const E = module.exports = {}
const uu6 = require('../../uu6')

class Expect {
  constructor(o) {
    this.o = o
    this.isNot = false
  }

  check(cond) {
    uu6.be((cond && !this.isNot) || (!cond && this.isNot))
  }

  pass(f) {
    let cond = f(this.o)
    this.check(cond)
  }

  equal(o) {
    this.check(uu6.eq(this.o, o))
    return this
  }

  near(n, gap) {
    this.check(uu6.near(this.o, n, gap))
    return this
  }

  type(type) { 
    this.check(uu6.type(this.o, type))
    return this
  }

  a(type) {
    this.check(uu6.type(this.o, type) || uu6.eq(this.o, type))
    return this
  }

  contain(member) {
    let m = uu6.member(this.o, member)
    this.check(m != null)
    this.o = m
    return this
  }

  property(member) { return this.contain(member) }
  
  include(member) { return this.contain(member) }

  get not() {
    this.isNot = !this.isNot
    return this
  }

  get to() { return this }
  get but() { return this }
  get at() { return this }
  get of() { return this }
  get same() { return this }
  get does() { return this }
  get do() { return this }
  get still() { return this }
  get is() { return this }
  get be() { return this }
  get should() { return this }
  get has() { return this }
  get have() { return this }
  get been() { return this }
  get that() { return this }
  get and() { return this }
  get to() { return this }
  get to() { return this }
  get to() { return this }
}

// let p = Expect.prototype
// p.to = 
// p.but = p.at = p.of = p.same = p.does = p.do = p.still = p.is = p.be = p.should = p.has = p.have = p.been = p.with = p.that = p.and = p.self
// p.include = p.property = p.contain
// p.a = p.type

E.expect = function (o) {
  return new Expect(o)
}

},{"../../uu6":29}],27:[function(require,module,exports){
const se6 = module.exports = {}

Object.assign(se6, require('./expect'))

},{"./expect":26}],28:[function(require,module,exports){
module.exports = {}

},{}],29:[function(require,module,exports){
module.exports = require('./src/uu6')
},{"./src/uu6":37}],30:[function(require,module,exports){
const A = module.exports = {}

A.defaults = function (args, defs) {
  let r = Object.assign({}, args)
  for (let k in defs) {
    r[k] = (args[k] == null) ? defs[k] : args[k]
  }
  return r
}

},{}],31:[function(require,module,exports){
const U = module.exports = {}

U.array = function (n, value=0) {
  let a = new Array(n)
  return a.fill(value)
}

U.repeats = function (n, f) {
  let r = []
  for (let i=0; i<n; i++) {
    r.push(f())
  }
  return r
}

U.push = function (a, o) {
  a.push(o)
}

U.pop = function (a) {
  return a.unshift()
}

U.enqueue = function (a, o) {
  a.unshift(o)
}

U.dequeue = function (a) {
  return a.unshift()
}

U.amap2 = function (a, b, f) {
  let len = a.length, c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = f(a[i], b[i])
  }
  return c
}

U.repeats = function (n, value = 0) {
  let a = new Array(n)
  return a.fill(value)
}

U.range = function (begin, end, step=1) {
  let len = Math.floor((end-begin)/step)
  let a = new Array(len)
  let i = 0
  for (let t=begin; t<end; t+=step) {
    a[i++] = t
  }
  return a
}

},{}],32:[function(require,module,exports){
const U = module.exports = {}


},{}],33:[function(require,module,exports){
const U = module.exports = {}

U.assert = function (cond, msg='assert fail!') {
  if (!cond) throw Error(msg)
}

U.be = U.assert 


},{}],34:[function(require,module,exports){
const U = module.exports = {}

U.eq = function (o1, o2) {
  if (o1 == o2) return true
  if (Object.is(o1,o2)) return true
  return JSON.stringify(o1) === JSON.stringify(o2)
}

U.near = function (n1, n2, gap=0.01) {
  let d = Math.abs(n1-n2)
  return d < gap
}

U.clone = function (o) {
  let type = typeof o
  if (Array.isArray(o))
    return o.slice(0)
  else if (type === 'object')
    return {...o}
  else
    return o
}

U.type = function (o, type) { // U.is
  if (typeof o === type) return true
  if (type==='array' && Array.isArray(o)) return true
  if (typeof o === 'object' && o instanceof type) return true
  return false
}

U.member = function (o, member) {
  if (typeof o === 'string') return member
  if (Array.isArray(o)) return o[o.indexOf(member)]
  if (o instanceof Set && o.has(member)) return member
  if (o instanceof Map) return o.get(member)
  return o[member]
}

U.contain = function (o, member) {
  return U.member(o, member) != null
}

U.omap2 = function (o1, o2, f) {
  let o = {}
  for (let k in o1) {
    o[k] = f(o1[k], o2[k])
  }
  return o
}

U.array2map = function (a) {
  let map = {}
  for (let i in a) {
    map[i] = a[i]
  }
  return map
}

U.key2value = function (o) {
  let r = {}
  for (let k in o) {
    let v = o[k]
    r[v] = k 
  }
  return r
}

U.mixin = Object.assign

},{}],35:[function(require,module,exports){
const U = module.exports = {}

U.random = function (min=0, max=1) {
  return min + Math.random()*(max-min)
}

U.randomInt = function (min, max) {
  return Math.floor(U.random(min, max))
}

U.randomChoose = function (a) {
  return a[U.randomInt(0, a.length)]
}

},{}],36:[function(require,module,exports){
const U = module.exports = {
  precision: 4,
  tab: undefined
}

U.json = function (o, tab, n) {
  let digits = n || this.precision || 4
  return JSON.stringify(o, function(key, val) {
    return val.toFixed ? Number(val.toFixed(digits)) : val
  }, tab)
}

},{}],37:[function(require,module,exports){
const uu6 = module.exports = require('./object')

uu6.mixin(uu6, 
  require('./array'),
  require('./error'),
  require('./string'),
  require('./random'),
  require('./control'),
  require('./args'),
)
},{"./args":30,"./array":31,"./control":32,"./error":33,"./object":34,"./random":35,"./string":36}]},{},[5]);
