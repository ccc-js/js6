const P = module.exports = require('./probability')
const uu6 = require('../../uu6')
// Uniform Distribution
P.dunif = (arg) => P.uniform.pdf(arg)
P.punif = (arg) => P.uniform.cdf(arg)
P.qunif = (arg) => P.uniform.inv(arg)
P.runif = (arg) => uu6.repeats(arg.n, ()=>P.uniform.sample(arg))
/*
P.runif = (arg) => {
  let r = uu6.repeats(arg.n, ()=>P.uniform.sample(arg))
  return r
}*/

// Exponential Distribution
P.dexp = (arg) => P.exp.pdf(arg)
P.pexp = (arg) => P.exp.cdf(arg)
P.qexp = (arg) => P.exp.inv(arg)
P.rexp = (arg) => uu6.repeats(arg.n, ()=>P.exp.sample(arg))

// Normal Distribution
P.dnorm = (arg) => P.normal.pdf(arg)
P.pnorm = (arg) => P.normal.cdf(arg)
P.qnorm = (arg) => P.normal.inv(arg)
P.rnorm = (arg) => uu6.repeats(arg.n, ()=>P.normal.sample(arg))

// Beta Distribution
P.dbeta = (arg) => P.beta.pdf(arg)
P.pbeta = (arg) => P.beta.cdf(arg)
P.qbeta = (arg) => P.beta.inv(arg)
P.rbeta = (arg) => uu6.repeats(arg.n, ()=>P.beta.sample(arg))

// F Distribution
P.df = (arg) => P.f.pdf(arg)
P.pf = (arg) => P.f.cdf(arg)
P.qf = (arg) => P.f.inv(arg)
P.rf = (arg) => uu6.repeats(arg.n, ()=>P.f.sample(arg))

// Cauchy Distribution
P.dcauchy = (arg) => P.cauchy.pdf(arg)
P.pcauchy = (arg) => P.cauchy.cdf(arg)
P.qcauchy = (arg) => P.cauchy.inv(arg)
P.rcauchy = (arg) => uu6.repeats(arg.n, ()=>P.cauchy.sample(arg))

// ChiSquare Distribution
P.dchisq = (arg) => P.chiSquare.pdf(arg)
P.pchisq = (arg) => P.chiSquare.cdf(arg)
P.qchisq = (arg) => P.chiSquare.inv(arg)
P.rchisq = (arg) => uu6.repeats(arg.n, ()=>P.chiSquare.sample(arg))

// Gamma Distribution
P.dgamma = (arg) => P.gamma.pdf(arg)
P.pgamma = (arg) => P.gamma.cdf(arg)
P.qgamma = (arg) => P.gamma.inv(arg)
P.rgamma = (arg) => uu6.repeats(arg.n, ()=>P.gamma.sample(arg))

// InvGamma Distribution
P.dinvgamma = (arg) => P.invGamma.pdf(arg)
P.pinvgamma = (arg) => P.invGamma.cdf(arg)
P.qinvgamma = (arg) => P.invGamma.inv(arg)
P.rinvgamma = (arg) => uu6.repeats(arg.n, ()=>P.invGamma.sample(arg))

// T Distribution
P.dt = (arg) => P.t.pdf(arg)
P.pt = (arg) => P.t.cdf(arg)
P.qt = (arg) => P.t.inv(arg)
P.rt = (arg) => uu6.repeats(arg.n, ()=>P.t.sample(arg))

// uniform
P.dweibull = (arg) => P.weibull.pdf(arg)
P.pweibull = (arg) => P.weibull.cdf(arg)
P.qweibull = (arg) => P.weibull.inv(arg)
P.rweibull = (arg) => uu6.repeats(arg.n, ()=>P.weibull.sample(arg))
