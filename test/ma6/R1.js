const {expect} = require('../../js6/se6')
const ma6 = require('../../js6/ma6')

describe('ma6: Probability test', function() {
  it('uniform test', function() {
    expect(ma6.dunif({x:0.5, a:0, b:10})).to.near(0.1)
    expect(ma6.punif({x:0.5, a:0, b:10})).to.near(0.05)
    expect(ma6.qunif({p:0.5, a:0, b:10})).to.near(5)
    expect(ma6.runif({a:0, b:10, n:10})).to.each((x)=>x < 10)
  })
})

