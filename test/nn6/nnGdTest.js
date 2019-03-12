const expect = require('../../se6').expect
const ai6 = require('../../ai6')
const nn6 = require('../../nn6')
var net = require('./net1')

describe('nn.Net result of gradientDescendent Algorithm', function() {
  it('gd result point should be near zero', function() {
    let p = ai6.gradientDescendent(net, [1, 2], {call: nn6.Net.call, grad: nn6.Net.grad, debug: false})
    console.log('p=', p, 'norm=', p.norm())
    expect(p.v[0]).to.near(3)
  })
})
