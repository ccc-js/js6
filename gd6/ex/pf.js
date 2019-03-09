const gd6 = require('..')

function f(v) {
  let [x,y] = v
  return x*x+y*y
}

module.exports = new gd6.Plugin(f)
