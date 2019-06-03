let se6 = require('../../js6/se6')
let {expect} = se6

describe('se6.expect', function() {
  it('number test', function() {
    expect(2).to.be.a('number')
  })
  it('array test', function() {
    let a = [1,2,3]
    expect(a).contain(2)
    expect(a).to.contain(1)
    expect(a).to.not.contain(5)
    expect(a).all((i)=>a.indexOf(i)>=0) 
    expect(a).any((i)=>i===2)
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
