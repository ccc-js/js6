const expect = require('../../se6').expect
const nn6 = require('../../nn6')
var net = require('./net1')
let p = net
describe('nn6.Net', function() {
  it('test Net.call and Net.grad', function() {
    let out = nn6.Net.call(net, p)
    expect(out).to.equal(2)
    nn6.Net.grad(net, p)
    console.log(net.toString())
    expect(net.vars[0].g).to.equal(-2)
  })
})

