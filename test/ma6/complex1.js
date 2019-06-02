const expect = require('../../js6/se6').expect
const ma6 = require('../../js6/ma6')
const {oo} = ma6

describe('ma6 test', function() {
  it('Complex test', function() {
    let a = oo('1+2i')
    let b = oo('2+1i')
    expect(a.add(b).sub(b)).to.equal(a)
    let e = a.mul(b).div(b) // .toFixed(4)
    console.log('e=%j', e)
    expect(e.v.r).to.near(a.v.r)
  })
})

