const expect = require('../../se6').expect
const ai6 = require('../../ai6')

function f(v) {
  let [x,y] = v
  return x*x+y*y
}

describe('ai6.gradientDescendent Algorithm', function() {
  it('gd result point should be near zero', function() {
    let p = ai6.gd(f, [3,2], {debug: false})
    console.log('p=', p, 'norm=', p.norm())
    expect(p).to.pass(p=>p.norm()<0.1)
  })
})
