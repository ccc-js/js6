let se6 = require('../../js6/se6')
let {希望, 願, 確認, 驗證} = se6

describe('se6.expect 中文測試', function() {
  it('number test', function() {
    希望(2).是('number')
  })
  it('array test', function() {
    let a = [1,2,3]
    願(a).包含(2)
    驗證(a).包含(1)
    確認(a).不.包含(5)
    願(a).每個((i)=>a.indexOf(i)>=0)
  })
  it('object test', function() {
    let o = {name:'ccc'}
    希望(o).包含('name').那個.是('ccc')
  })
  it('pass test', function() {
    let o = {name:'ccc'}
    確認(o).通過((o)=>o.name==='ccc')
  })
})
