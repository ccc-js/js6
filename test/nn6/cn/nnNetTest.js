const expect = require('../../../js6/se6').expect
const ai6 = require('../../../js6/ai6')
const nn6 = require('../../../js6/nn6')
var net = require('./net1')
describe('nn6.Net', function() {
  it('gd result net.x.v should be near 3', function() {
    net.gradientDescendent() // optimize()
    console.log('net.vars=%j', net.vars)
    expect(net.vars[0].v).to.near(3, 0.1)
  })
})

  /*
  it('test Net.call and Net.grad', function() {
    let out = nn6.Net.call(net, p)
    expect(out).to.equal(2)
    nn6.Net.grad(net, p)
    // console.log(net.toString())
    expect(net.vars[0].g).to.equal(-2)
  })
  */
 