var expect = require('../../se6').expect

describe('se6.expect', function() {
  it('number test', function() {
    expect(2).to.be.a('number')
  })
  it('array test', function() {
    let a = [1,2,3]
    expect([1,2,3]).contain(2)
    expect(a).to.contain(1)
    expect(a).to.not.contain(5)
  })
  it('object test', function() {
    let o = {name:'ccc'}
    expect(o).to.contain('name').that.is.a('ccc')
  })
  it('pass test', function() {
    let o = {name:'ccc'}
    expect(o).to.pass((o)=>o.name==='ccc')
  })
})
