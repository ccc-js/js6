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