const expect = require('../../js6/se6').expect
const uu6 = require('../../js6/uu6')

describe('uu6 test', function() {
  it('args test', function() {
    let args = { debug: true }
    let defs = { step: 0.01, gap: 0.001, debug: false }
    let arg2 = uu6.defaults(args, defs)
    expect(arg2).to.pass(o=>o.step === 0.01 && o.debug === true)
  })

  // let args2 = uu6.defaults(args, {call:ma6.Point.call, grad:ma6.Point.grad, step:0.01, gap:0.0001, debug:true})
})
