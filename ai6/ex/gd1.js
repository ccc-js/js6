const ai6 = require('..')

function f(v) {
  let [x,y] = v
  return x*x+y*y
}

ai6.gd(f, [3,2])
