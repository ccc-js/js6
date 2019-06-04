const P = require('./probability')
const R = module.exports = {}

R.rdist = function (name) {
  return eval(`
    let f=function (arg) { 
      let {n} = arg, v = new Array(n)
      for (let i=0; i<n; i++) v[i] = P.${name}.sample(arg)
      return v
    }; f
  `)
}

// Uniform Distribution
R.dunif = (arg) => P.uniform.pdf(arg)
R.punif = (arg) => P.uniform.cdf(arg)
R.qunif = (arg) => P.uniform.inv(arg)
R.runif = R.rdist('uniform')
// R.runif = (arg) => R.repeats(arg, (arg)=>P.uniform.sample(arg))

// Exponential Distribution
R.dexp = (arg) => P.exp.pdf(arg)
R.pexp = (arg) => P.exp.cdf(arg)
R.qexp = (arg) => P.exp.inv(arg)
R.rexp = (arg) => R.repeats(arg, (arg)=>P.exp.sample(arg))

// Normal Distribution
R.dnorm = (arg) => P.normal.pdf(arg)
R.pnorm = (arg) => P.normal.cdf(arg)
R.qnorm = (arg) => P.normal.inv(arg)
R.rnorm = R.rdist('norm')
// R.rnorm = (arg) => R.repeats(arg, (arg)=>P.normal.sample(arg))

// Beta Distribution
R.dbeta = (arg) => P.beta.pdf(arg)
R.pbeta = (arg) => P.beta.cdf(arg)
R.qbeta = (arg) => P.beta.inv(arg)
R.rbeta = R.rdist('beta')
// R.rbeta = (arg) => R.repeats(arg, (arg)=>P.beta.sample(arg))

// F Distribution
R.df = (arg) => P.f.pdf(arg)
R.pf = (arg) => P.f.cdf(arg)
R.qf = (arg) => P.f.inv(arg)
R.rf = R.rdist('f')
// R.rf = (arg) => R.repeats(arg, (arg)=>P.f.sample(arg))

// Cauchy Distribution
R.dcauchy = (arg) => P.cauchy.pdf(arg)
R.pcauchy = (arg) => P.cauchy.cdf(arg)
R.qcauchy = (arg) => P.cauchy.inv(arg)
R.rcauchy = R.rdist('cauchy')
// R.rcauchy = (arg) => R.repeats(arg, (arg)=>P.cauchy.sample(arg))

// ChiSquare Distribution
R.dchisq = (arg) => P.chiSquare.pdf(arg)
R.pchisq = (arg) => P.chiSquare.cdf(arg)
R.qchisq = (arg) => P.chiSquare.inv(arg)
R.rchisq = R.rdist('chisq')
// R.rchisq = (arg) => R.repeats(arg, (arg)=>P.chiSquare.sample(arg))

// Gamma Distribution
R.dgamma = (arg) => P.gamma.pdf(arg)
R.pgamma = (arg) => P.gamma.cdf(arg)
R.qgamma = (arg) => P.gamma.inv(arg)
R.rgamma = R.rdist('gamma')
// R.rgamma = (arg) => R.repeats(arg, (arg)=>P.gamma.sample(arg))

// InvGamma Distribution
R.dinvgamma = (arg) => P.invGamma.pdf(arg)
R.pinvgamma = (arg) => P.invGamma.cdf(arg)
R.qinvgamma = (arg) => P.invGamma.inv(arg)
R.rinvgamma = R.rdist('invgamma')
// R.rinvgamma = (arg) => R.repeats(arg, (arg)=>P.invGamma.sample(arg))

// T Distribution
R.dt = (arg) => P.t.pdf(arg)
R.pt = (arg) => P.t.cdf(arg)
R.qt = (arg) => P.t.inv(arg)
R.rt = R.rdist('t')
// R.rt = (arg) => R.repeats(arg, (arg)=>P.t.sample(arg))

// Weibull Distribution
R.dweibull = (arg) => P.weibull.pdf(arg)
R.pweibull = (arg) => P.weibull.cdf(arg)
R.qweibull = (arg) => P.weibull.inv(arg)
R.rweibull = R.rdist('weibull')
// R.rweibull = (arg) => R.repeats(arg, (arg)=>P.weibull.sample(arg))

/*
// const T = require('./tensor')
const uu6 = require('../../uu6')
const {oo} = require('./oo')
R.repeats = function (arg, f) {
  let n = arg.n, v = new Array(n)
  for (let i=0; i<n; i++) {
    v[i] = f(arg)
  }
  return v // oo(v)
}
*/