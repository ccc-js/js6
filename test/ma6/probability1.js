const {expect} = require('../../js6/se6')
const ma6 = require('../../js6/ma6')
const uu6 = require('../../js6/uu6')
const P = ma6.P

function check(x, d, arg) {
  let dx = 0.000001
  let argx = Object.assign({}, {x}, arg)
  let p = d.cdf(argx)
  let argp = Object.assign({}, {p}, arg)
  let x2 = d.inv(argp)
  console.log('x=', x, 'p=', p, 'x2=', x2)
  expect(x2).to.near(x)
  let argx1 = Object.assign({}, {x:x+dx}, arg)
  let p1 = d.cdf(argx1)
  let dp = (p1-p)/dx
  expect(dp).to.near(d.pdf(argx))
}

let x = 0.7

describe('ma6: Probability test', function() {
  it('uniform test', function() {
    check(x, P.uniform, {a:0, b:5})
  })
  it('normal test', function() {
    check(x, P.normal, {mu:2, sd:3})
  })
  it('exp test', function() {
    check(x, P.exp, {rate:2})
  })
  it('beta test', function() {
    check(x, P.beta, {alpha:2, beta:3})
  })
  it('f test', function() {
    check(x, P.f, {df1:5, df2:10})
  })
  it('chiSquare test', function() {
    check(x, P.chiSquare, {dof:3})
  })
  it('cauchy test', function() {
    check(x, P.cauchy, {local:2, scale:3})
  })
  it('gamma test', function() {
    check(x, P.gamma, {shape:2, scale:3})
  })
  it('invGamma test', function() {
    check(x, P.invGamma, {shape:2, scale:3})
  })
  it('t test', function() {
    check(x, P.t, {dof:3})
  })
  it('weibull test', function() {
    check(x, P.weibull, {shape:2, scale:3})
  })
  // Discrete
  it('binomial test', function() {
    let arg = {k:5, p:0.5, n:5}
    console.log('binomial.pdf(%j)=%d', arg, P.binomial.pdf(arg))
    expect(P.binomial.pdf(arg)).to.near(1/32)
    console.log('binomial.cdf(%j)=%d', arg, P.binomial.cdf(arg))
    expect(P.binomial.cdf(arg)).to.near(1)
  })
  it('negBinomial test', function() {
    let arg = {k:3, p:0.5, r:5, x: 6}
    console.log('negBinomial.pdf(%j)=%d', arg, P.negBinomial.pdf(arg))
    expect(P.negBinomial.pdf(arg)).to.near(0.13671875)
    console.log('negBinomial.cdf(%j)=%d', arg, P.negBinomial.cdf(arg))
    expect(P.negBinomial.cdf(arg)).to.near(0.7255859375)
  })
  it('poisson test', function() {
    let arg = {k:3, l:2, x:3}
    console.log('poisson.pdf(%j)=%d', arg, P.poisson.pdf(arg))
    expect(P.poisson.pdf(arg)).to.near(0.1804470443154836)
    console.log('poisson.cdf(%j)=%d', arg, P.poisson.cdf(arg))
    expect(P.poisson.cdf(arg)).to.near(0.8571234604985472)
  })
})

