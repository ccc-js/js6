const ma6 = require('../../js6/ma6')

function f(v) {
  let [x,y,z] = v
  return x*x+y*y+z*z
}

let p = new ma6.Point([1,2,3])

console.log('call(f)=', ma6.Point.call(f,p))
console.log('grad(f)=', ma6.Point.grad(f,p))
