const ma6 = require('../../js6/ma6')
const {D} = ma6
const {diff, diff2, diffn} = D
const {cos, sin, PI} = Math

// 一次數值微分
console.log('=========== 一次微分 ==============')
let dsin1 = diff(sin, PI/4)
console.log('diff(sin,pi/4)=', dsin1)
console.log('cos(pi/4)=', cos(PI/4))

// 二次數值微分
console.log('=========== 二次微分 ==============')
let dsin2 = diff2(sin, PI/4)
console.log('diff2(sin,pi/4)=', dsin2)
console.log('-sin(pi/4)=', -sin(PI/4))

const dsin = [sin, cos, (x)=>-sin(x), (x)=>-cos(x)]
// n 次數值微分 : 有嚴重的誤差擴散
console.log('=========== n 次微分 ==============')
for (let n=0; n<10; n++) {
  console.log('數值微分: diffn(sin, %d, pi/4)=%d', n, diffn(sin, n, PI/4))
  console.log('算式微分：dsin^%d/dx(sin,pi/4)=%d', n, n, dsin[n%4](PI/4))
}


