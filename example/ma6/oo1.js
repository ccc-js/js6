const {OO, RA} = require('../../js6/ma6')

console.log('==================vector============')
let a = [2,4,3]
let b = [1,2,3]
let c = 2
console.log('a=', a, '\nb=', b, '\nc=', c)
console.log('add(a,b)=%j', OO.add(a,b))
console.log('add(a,c)=%j', OO.add(a,c))
console.log('add(c,b)=%j', OO.add(c,b))
console.log('add(c,c)=%j', OO.add(c,c))

console.log('==================ratio============')
a = RA.ratio('3/5'), b=RA.ratio('5/3')
console.log('a=', a, 'b=', b)
console.log('add(a,b)=', OO.add(a,b))
console.log('mul(a,b)=', OO.mul(a,b))
