const {OO} = require('../../js6/ma6')
const {oo} = OO

console.log('==================matrix============')
let m = oo({v:[1,2,3,4], shape:[2,2]})
console.log('m=%s', m)
let mt = m.transpose()
console.log('mt=%s', mt)
let mm = m.mdot(mt)
console.log('mm=%s', mm)
let svd = m.svd()
console.log('svd=%j', svd)
console.log('mm.inv()=%s', mm.inv())
console.log('mm.det()=%d', mm.det())
