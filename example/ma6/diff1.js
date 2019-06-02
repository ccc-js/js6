const ma6 = require('../../js6/ma6')
// const {D} = ma6
const {diff, diff2, diffn} = ma6
const {cos, sin, PI} = Math

/*
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
*/

const dsin = [sin, cos, (x)=>-sin(x), (x)=>-cos(x)]
// n 次數值微分 : 有嚴重的誤差擴散 (猜測原因: 因為不斷除以 h=0.01，於是當上面不准時，除 h 之後就會放大很多！)
console.log('=========== n 次微分 ==============')
for (let n=1; n<10; n++) {
  console.log('%d 次數值微分: diffn(sin, %d, pi/4)=%d', n, n, diffn(sin, n, PI/4))
  console.log('%d 次算式微分：dsin^%d/dx(sin,pi/4)=%d', n, n, dsin[n%4](PI/4))
}


