const expect = require('../../js6/se6').expect
const uu6 = require('../../js6/uu6')
const ma6 = require('../../js6/ma6')
const {T, V, oo} = ma6

describe('ma6 test', function() {
  it('Tensor test', function() {
    let shape = [2,2,3], idx=[1,1,2]
    let v = uu6.range(0,12)
    console.log('v=%j', v)
    let t = oo(v).toTensor().reshape(shape)
    console.log('t=', t.toString())
    console.log('t.get(...idx)=', t.get(...idx))
    // expect(t.get(...idx).r).to.equal(11)
    t.reshape([3,4])
    console.log('t=', t.toString())
    let nd = t.ndarray()
    console.log('nd=%j', nd)
    expect(nd.v).to.equal([[0,1,2,3],[4,5,6,7],[8,9,10,11]])
  })
})
