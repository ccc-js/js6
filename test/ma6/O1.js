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
    expect(b).to.equal(oo([2,3,4]))
  })
  it('uniform test', function() {
    /*
    let t = O.runif({a:0, b:10, n:100})
    console.log('t=', t)
    console.log('rowSum()=', t.reshape([10,10]).rowSum().toString())
    // console.log('t=', t.toString())
    console.log('hist()=', t.hist())
    */
  })
})

