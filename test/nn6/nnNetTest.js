const expect = require('../../se6').expect
const nn6 = require('../../nn6')
const ma6 = require('../../ma6')
var net = require('./net1')

describe('nn6.Net', function() {
  it('test Net.call and Net.grad', function() {
    let p = new ma6.Point([1, 2])
    console.log('forward: f()')
    console.log('main: p=', p)
    let out = nn6.Net.call(net, p)
    console.log('out=', out)
    expect(out).to.equal(8)
    let g = nn6.Net.grad(net, p)
    console.log('g=', g)
    expect(g.v).to.equal([-4,4])
    console.log(net.dump())
  })
})

