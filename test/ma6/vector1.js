const expect = require('../../js6/se6').expect
const ma6 = require('../../js6/ma6')
const {V} = ma6
// const Vector = ma6.Vector

describe('ma6 test', function() {
  it('Vector test', function() {
    let a = [2,4,6]
    let b = [1,2,3]
    let c = 2
    // expect(a.neg().ndarray()).to.equal([-2,-4,-6])
    expect(V.neg(a)).to.equal([-2,-4,-6])
    expect(V.dot(a, b)).to.equal(28)
    expect(V.sum(a)).to.equal(12)
    expect(V.mean(a)).to.equal(4)
    expect(V.sd(a)).to.equal(2)
    /*
    expect(a.add(b).sub(b).mul(b).div(b).mul(c).mul(1/c).ndarray()).to.equal(a)
    expect(a.dot(b)).to.equal(28)
    expect(a.sum()).to.equal(12)
    expect(a.mean()).to.equal(4)
    expect(a.sd()).to.equal(2)
    */
  })
})

