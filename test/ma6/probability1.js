const {expect} = require('../../js6/se6')
const ma6 = require('../../js6/ma6')
const uu6 = require('../../js6/uu6')

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
    check(x, ma6.uniform, {a:0, b:5})
  })
  it('normal test', function() {
    check(x, ma6.normal, {mu:2, sd:3})
  })
  it('exp test', function() {
    check(x, ma6.exp, {rate:2})
  })
  it('beta test', function() {
    check(x, ma6.beta, {alpha:2, beta:3})
  })
  it('f test', function() {
    check(x, ma6.f, {df1:5, df2:10})
  })
  it('chiSquare test', function() {
    check(x, ma6.chiSquare, {dof:3})
  })
  it('cauchy test', function() {
    check(x, ma6.cauchy, {local:2, scale:3})
  })
  it('gamma test', function() {
    check(x, ma6.gamma, {shape:2, scale:3})
  })
  it('invGamma test', function() {
    check(x, ma6.invGamma, {shape:2, scale:3})
  })
  it('t test', function() {
    check(x, ma6.t, {dof:3})
  })
  it('weibull test', function() {
    check(x, ma6.weibull, {shape:2, scale:3})
  })
  // Discrete
  it('binomial test', function() {
    let arg = {k:5, p:0.5, n:5}
    console.log('binomial.pdf(%j)=%d', arg, ma6.binomial.pdf(arg))
    expect(ma6.binomial.pdf(arg)).to.near(1/32)
    console.log('binomial.cdf(%j)=%d', arg, ma6.binomial.cdf(arg))
    expect(ma6.binomial.cdf(arg)).to.near(1)
  })
  it('negBinomial test', function() {
    let arg = {k:3, p:0.5, r:5, x: 6}
    console.log('negBinomial.pdf(%j)=%d', arg, ma6.negBinomial.pdf(arg))
    expect(ma6.negBinomial.pdf(arg)).to.near(0.13671875)
    console.log('negBinomial.cdf(%j)=%d', arg, ma6.negBinomial.cdf(arg))
    expect(ma6.negBinomial.cdf(arg)).to.near(0.7255859375)
  })
  it('poisson test', function() {
    let arg = {k:3, l:2, x:3}
    console.log('poisson.pdf(%j)=%d', arg, ma6.poisson.pdf(arg))
    expect(ma6.poisson.pdf(arg)).to.near(0.1804470443154836)
    console.log('poisson.cdf(%j)=%d', arg, ma6.poisson.cdf(arg))
    expect(ma6.poisson.cdf(arg)).to.near(0.8571234604985472)
  })
})

