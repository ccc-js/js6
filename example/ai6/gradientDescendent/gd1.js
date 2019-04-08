const ai6 = require('../../../js6/ai6')
const ma6 = require('../../../js6/ma6')

function f(v) {
  let [x,y] = v
  return x*x+y*y
}

ai6.gd(f, new ma6.Point([3,2]))
