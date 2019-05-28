const uu6 = require('../../js6/uu6')
const ma6 = require('../../js6/ma6')
const {T, V} = ma6

let shape = [2,2,3], idx=[1,1,2]
let v = uu6.range(0,12)
console.log('v=', v)

let t = ma6.tensor(v, shape)
console.log('t.get(%j)=', idx, t.get(...idx))

t.reshape([3,4])

console.log('t=', t)

let nd = t.ndarray()
console.log('nd=', nd)

console.log('t.ndarray()=', uu6.json(t.ndarray()))

let t2 = T.tensor(nd)
console.log('t2=', t2)

/*
console.log('t.ndarray()=', uu6.json(t.ndarray()))

let nd = [[1,2],[3,4]]
console.log('nd=', nd)
t = new Tensor(nd)
console.log('t=', t)

let nd2 = t.ndarray()
console.log('nd2=', nd2)
*/


// console.log('t.slice([1,1],[3,3]=', t.slice([1,1], [3,3]))
