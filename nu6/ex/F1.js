const nu6 = require('..')
const F = nu6.F

let p0 = [1,2,3]

function f(p) {
  let [x,y,z] = p
  return x*x+y*y+z*z
}

console.log('grad(f)=', F.grad(f, p0))
