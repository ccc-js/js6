const ai6 = require('..')
const ma6 = require('../../ma6')

function f(p) {
  let [x,y] = p.v
  return x*x+y*y
}

ai6.gd(f, new ma6.Point([3,2]))
