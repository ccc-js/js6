const {expect} = require('../../js6/se6')
const ma6 = require('../../js6/ma6')
const {R} = ma6
const uu6 = require('../../js6/uu6')

describe('ma6: Probability test', function() {
  it('uniform test', function() {
    expect(R.dunif({x:0.5, a:0, b:10})).to.near(0.1)
    expect(R.punif({x:0.5, a:0, b:10})).to.near(0.05)
    expect(R.qunif({p:0.5, a:0, b:10})).to.near(5)
    expect(R.runif({a:0, b:1, n:100})).each((o)=>o>0 && o<1)
  })
})

    /*
    let t = O.runif({a:0, b:10, n:100})
    console.log('t=', t)
    let t10 = t.toTensor().reshape([10,10])
    console.log('t10=', t10)
    console.log('rowSum()=', t10.rowSum().toString())
    // console.log('t=', t.toString())
    console.log('hist()=', t.hist())

    t = ma6.runif({a:0, b:10, n:10000}).reshape([100, 100])
    let r = t.rowMean()
    console.log('r=', r)
    
    // t = ma6.runif({a:0, b:10, n:10000}).reshape([1000, 10])
    // let t = ma6.runif({a:0, b:10, n:100000})
    t = O.runif({a:0, b:10, n:1000000}).reshape([10000, 100])
    let r = t.rowMean()
    console.log('r.v.shape=', r.v.shape)
    let r2 = r.reshape([100, 100]).rowMean()
    // console.log('r2=', r2.toString())
    let h = r2.hist(3, 7, 0.2)
    console.log('h=', uu6.json(h))
    expect(h.bins[0]).to.equal(0)
    */