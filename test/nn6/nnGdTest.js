const expect = require('../../se6').expect
const ai6 = require('../../ai6')
const nn6 = require('../../nn6')
var net = require('./net1')
let f = p0 = net

describe('nn.Net result of gradientDescendent Algorithm', function() {
  it('gd result net.x.v should be near 3', function() {
    ai6.gradientDescendent(f, p0, {call: nn6.Net.call, grad: nn6.Net.grad, step: nn6.Net.step, debug: false})
    expect(net.vars[0].v).to.near(3, 0.1)
  })
})
