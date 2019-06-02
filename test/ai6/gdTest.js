const expect = require('../../js6/se6').expect
const ai6 = require('../../js6/ai6')
const ma6 = require('../../js6/ma6')
const {V} = ma6

function f(v) {
  let [x,y] = v
  return x*x+y*y
}

describe('ai6.gradientDescendent Algorithm', function() {
  it('gd result point should be near zero', function() {
    let p = ai6.gd(f, [3,2], {debug: false})
    console.log('p=', p, 'norm=', V.norm(p))
    expect(p).to.pass(p=>V.norm(p)<0.1)
  })
})
