const gd6 = require('..')

function f(p) {
  let {x,y} = p
  return x*x+y*y
}

module.exports = new gd6.Plugin(f)
