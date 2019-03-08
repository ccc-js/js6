const uu6 = require('../')

let o = {pi:Math.PI, e:Math.E }

console.log('o', o)
console.log('clone(o)=', uu6.clone(o))
console.log('json(o)=', uu6.json(o))

