const ma6 = require('../../js6/ma6')

let p = new ma6.Polynomial([1,-2,1]) // 1-2x+x^2
console.log('p.sum(1)=', p.sum(1))
console.log('p.sum(2)=', p.sum(2))
console.log('p.sum(3)=', p.sum(3))

let x0 = 1
console.log('expSeries(%d).sum(10, %d)=%d', x0, 1, ma6.expSeries(x0).sum(10, 1))
console.log('sinSeries(%d).sum(10, Pi/4)=%d', x0, ma6.sinSeries(x0).sum(10, Math.PI/4))
