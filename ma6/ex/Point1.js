const ma6 = require('..')

let p0 = new ma6.Point([1,2,3])

function f(p) {
  let [x,y,z] = p.v
  return x*x+y*y+z*z
}

console.log('grad(f)=', p0.grad(f))
