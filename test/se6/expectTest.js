let se6 = require('../../se6')
let {expect, 希望, 願, 確認, 驗證} = se6

describe('se6.expect', function() {
  it('number test', function() {
    expect(2).to.be.a('number')
    希望(2).是('number')
  })
  it('array test', function() {
    let a = [1,2,3]
    expect(a).contain(2)
    願(a).包含(2)
    expect(a).to.contain(1)
    驗證(a).包含(1)
    expect(a).to.not.contain(5)
    確認(a).不.包含(5)
  })
  it('object test', function() {
    let o = {name:'ccc'}
    expect(o).to.contain('name').that.is.a('ccc')
    希望(o).包含('name').那個.是('ccc')
  })
  it('pass test', function() {
    let o = {name:'ccc'}
    expect(o).to.pass((o)=>o.name==='ccc')
    確認(o).通過((o)=>o.name==='ccc')
  })
})
