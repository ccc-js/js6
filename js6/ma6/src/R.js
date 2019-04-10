const P = require('./probability')
const R = module.exports = {}
const uu6 = require('../../uu6')

// Uniform Distribution
R.dunif = (arg) => P.uniform.pdf(arg)
R.punif = (arg) => P.uniform.cdf(arg)
R.qunif = (arg) => P.uniform.inv(arg)
R.runif = (arg) => uu6.repeats(arg.n, ()=>P.uniform.sample(arg))

// Exponential Distribution
R.dexp = (arg) => P.exp.pdf(arg)
R.pexp = (arg) => P.exp.cdf(arg)
R.qexp = (arg) => P.exp.inv(arg)
R.rexp = (arg) => uu6.repeats(arg.n, ()=>P.exp.sample(arg))

// Normal Distribution
R.dnorm = (arg) => P.normal.pdf(arg)
R.pnorm = (arg) => P.normal.cdf(arg)
R.qnorm = (arg) => P.normal.inv(arg)
R.rnorm = (arg) => uu6.repeats(arg.n, ()=>P.normal.sample(arg))

// Beta Distribution
R.dbeta = (arg) => P.beta.pdf(arg)
R.pbeta = (arg) => P.beta.cdf(arg)
R.qbeta = (arg) => P.beta.inv(arg)
R.rbeta = (arg) => uu6.repeats(arg.n, ()=>P.beta.sample(arg))

// F Distribution
R.df = (arg) => P.f.pdf(arg)
R.pf = (arg) => P.f.cdf(arg)
R.qf = (arg) => P.f.inv(arg)
R.rf = (arg) => uu6.repeats(arg.n, ()=>P.f.sample(arg))

// Cauchy Distribution
R.dcauchy = (arg) => P.cauchy.pdf(arg)
R.pcauchy = (arg) => P.cauchy.cdf(arg)
R.qcauchy = (arg) => P.cauchy.inv(arg)
R.rcauchy = (arg) => uu6.repeats(arg.n, ()=>P.cauchy.sample(arg))

// ChiSquare Distribution
R.dchisq = (arg) => P.chiSquare.pdf(arg)
R.pchisq = (arg) => P.chiSquare.cdf(arg)
R.qchisq = (arg) => P.chiSquare.inv(arg)
R.rchisq = (arg) => uu6.repeats(arg.n, ()=>P.chiSquare.sample(arg))

// Gamma Distribution
R.dgamma = (arg) => P.gamma.pdf(arg)
R.pgamma = (arg) => P.gamma.cdf(arg)
R.qgamma = (arg) => P.gamma.inv(arg)
R.rgamma = (arg) => uu6.repeats(arg.n, ()=>P.gamma.sample(arg))

// InvGamma Distribution
R.dinvgamma = (arg) => P.invGamma.pdf(arg)
R.pinvgamma = (arg) => P.invGamma.cdf(arg)
R.qinvgamma = (arg) => P.invGamma.inv(arg)
R.rinvgamma = (arg) => uu6.repeats(arg.n, ()=>P.invGamma.sample(arg))

// T Distribution
R.dt = (arg) => P.t.pdf(arg)
R.pt = (arg) => P.t.cdf(arg)
R.qt = (arg) => P.t.inv(arg)
R.rt = (arg) => uu6.repeats(arg.n, ()=>P.t.sample(arg))

// Weibull Distribution
R.dweibull = (arg) => P.weibull.pdf(arg)
R.pweibull = (arg) => P.weibull.cdf(arg)
R.qweibull = (arg) => P.weibull.inv(arg)
R.rweibull = (arg) => uu6.repeats(arg.n, ()=>P.weibull.sample(arg))
