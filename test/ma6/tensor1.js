const expect = require('../../se6').expect
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')
const {T, V} = ma6

describe('ma6 test', function() {
  it('Tensor test', function() {
    let shape = [2,2,3], idx=[1,1,2]
    let v = uu6.range(0,12)
    let t = ma6.tensor(v, shape)
    expect(t.get(...idx)).to.equal(11)
    t.reshape([3,4])
    let nd = t.ndarray()
    expect(t.ndarray()).to.equal([[0,1,2,3],[4,5,6,7],[8,9,10,11]])
    let t2 = T.tensor(nd)
    expect(t).to.equal(t2)
  })
})
