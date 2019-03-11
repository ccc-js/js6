const uu6 = require('../../uu6')
const ma6 = require('..')
const {Tensor, V} = ma6

let shape = [2,2,3], idx=[1,1,2]
let v = V.range(0,12)
console.log('v=', v)

let t = new Tensor(v, shape)
console.log('t.get(%j)=', idx, t.get(...idx))

t.reshape([3,4])

console.log('t=', t)

let t2 = t.row(2)
console.log('t2=', t2)

console.log('t.ndarray()=', uu6.json(t.ndarray()))

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
