const expect = require('../../js6/se6').expect
const ma6 = require('../../js6/ma6')
const Complex = ma6.Complex

describe('ma6 test', function() {
  it('Complex test', function() {
    let a = new Complex(1, 2)
    let b = new ma6.parseComplex('2+1i')
    expect(a.add(b).sub(b)).to.equal(a)
    let e = a.mul(b).div(b).toFixed(4)
    expect(e).to.equal(a)
  })
})

