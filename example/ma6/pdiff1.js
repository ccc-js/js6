const ma6 = require('../../js6/ma6')
const {pdiff, pdiff2, pdiffn} = ma6
const {cos, sin, PI} = Math

let f = function(v) { let [x,y] = v; return sin(x)*y }
let x = PI/4, y = 1

/*
// 一次數值微分
console.log('=========== 一次微分 ==============')
let d1 = pdiff(f, 0, [x,y])
console.log('pdiff(sin(x)*y, pi/4)=', d1)
console.log('cos(pi/4)=', cos(PI/4))

// 二次數值微分
console.log('=========== 二次微分 ==============')
let d2 = pdiff2(f, 0, [x,y])
console.log('pdiff2(sin(x)*y, pi/4)=', d2)
console.log('-sin(pi/4)=', -sin(x))
*/
const dsin = [sin, cos, (x)=>-sin(x), (x)=>-cos(x)]
// n 次數值微分 : 有嚴重的誤差擴散
console.log('=========== n 次微分 ==============')
for (let n=1; n<10; n++) {
  console.log('數值微分: diffn(sin, %d, pi/4)=%d', n, pdiffn(f, 0, n, [x,y]))
  console.log('算式微分：dsin^%d/dx(sin,pi/4)=%d', n, dsin[n%4](x))
}

