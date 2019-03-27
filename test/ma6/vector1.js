const expect = require('../../se6').expect
const ma6 = require('../../ma6')
const Vector = ma6.Vector

describe('ma6 test', function() {
  it('Vector test', function() {
    let a = new Vector([2,4,6])
    let b = new Vector([1,2,3])
    let c = 2
    expect(a.neg()).to.equal(new Vector([-2,-4,-6]))
    expect(a.add(b).sub(b).mul(b).div(b).mulc(c).mulc(1/c)).to.equal(a)
    expect(a.dot(b)).to.equal(28)
    expect(a.sum()).to.equal(12)
    expect(a.mean()).to.equal(4)
    expect(a.sd()).to.equal(2)
  })
})

