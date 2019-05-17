const ma6 = require('../../js6/ma6')
const Matrix = ma6.Matrix

let a = new Matrix([[2,0],[0,2]])
let b = new Matrix([[1,3],[1,1]])
let ia = a.inv(), ib = b.inv()
let c = 2
console.log('a=', a, 'b=', b)
console.log('neg(a)=%s', a.neg())
console.log('tr(b)=%s', b.tr())
console.log('add(a,b)=%s', a.add(b))
console.log('sub(a,b)=%s', a.sub(b))
console.log('mul(a,b)=%s', a.mul(b))
console.log('div(a,b)=%s', a.div(b))
console.log('mod(a,b)=%s', a.mod(b))
console.log('powc(a,c)=%s',a.powc(c))
console.log('mulc(a,c)=%s',a.mulc(c))
console.log('dot(a,b)=%s', a.dot(b))
console.log('sum(a)=%s',   a.sum())
console.log('mean(a)=%s',  a.mean())
console.log('sd(a)=%s',    a.sd())

console.log('a.mulc(c).add(b).add(a)=%s', a.mulc(c).add(b).add(a))

console.log('b.rowSum()=%s', b.rowSum())
console.log('b.colSum()=%s', b.colSum())

console.log('ia=%s', ia)
console.log('a.dot(ia)=%s', a.dot(ia))
console.log('a.det()=%d', a.det())

console.log('ib=%s', ib)
console.log('b.dot(ib)=%s', b.dot(ib))
console.log('b.det()=%d', b.det())

console.log('b.lu()=%j', b.lu())
console.log('b.solve([5,5])=%j', b.solve([5,5]))
console.log('b.svd()=%j', b.svd())

