const expect = require('../../../se6').expect
const ai6 = require('../../../ai6')
const nn6 = require('../../../nn6')
var net = require('./net1')
let p = net
describe('nn6.Net', function() {
  it('test Net.call and Net.grad', function() {
    let out = nn6.Net.call(net, p)
    expect(out).to.equal(2)
    nn6.Net.grad(net, p)
    // console.log(net.toString())
    expect(net.vars[0].g).to.equal(-2)
  })
  it('gd result net.x.v should be near 3', function() {
    ai6.gradientDescendent(net, p, {call: nn6.Net.call, grad: nn6.Net.grad, step: nn6.Net.step, debug: false})
    expect(net.vars[0].v).to.near(3, 0.1)
  })
})

