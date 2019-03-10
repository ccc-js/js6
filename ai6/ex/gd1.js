const ai6 = require('..')
const nu6 = require('../../nu6')

function f(p) {
  let [x,y] = p.v
  return x*x+y*y
}

ai6.gd(f, new nu6.Point([3,2]))
