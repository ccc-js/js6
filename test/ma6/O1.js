const expect = require('../../js6/se6').expect
const {O} = require('../../js6/ma6')
const {oo} = O

describe('ma6: O test', function() {
  it('complex test', function() {
    let a = oo('1+2i')
    let b = a.add('1+1i')
    expect(b).to.equal(oo('2+3i'))
  })
  it('vector test', function() {
    let a = oo([1,2,3])
    let b = a.add([1,1,1])
    let c = a.add(b).sub(b)
    expect(b).to.equal(oo([2,3,4]))
    expect(c).to.equal(a)
  })
  it('tensor test', function() {
    let a = oo({r:[1,2,3],i:[1,1,1],shape:[3]})
    console.log('a=%j', a)
    let b = a.add(a)
    console.log('b=%j', b)
    let c = oo('1+0i')
    console.log('c=%j', c)
    let ac = a.mul(c)
    console.log('ac=%j', ac)
    expect(ac).to.equal(a)
  })
  it('R test', function() {
    let t = O.runif({a:0, b:10, n:100})
    let rs = t.reshape([10,10]).rowSum()
    // console.log('t=', t)
    console.log('rowSum()=%j', rs)
    expect(rs.v.r.length).to.equal(10)
    /*
    // console.log('t=', t.toString())
    console.log('hist()=', t.hist())
    */
  })
})

