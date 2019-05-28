const uu6 = require('../../js6/uu6')
const ma6 = require('../../js6/ma6')
const {T, V} = ma6

let shape = [2,2,3], idx=[1,1,2]
let v = uu6.range(0,12)
console.log('v=%j', v)

let t = {v:v, shape:shape}
console.log('t.get(%j)=', idx, T.get(t, ...idx))
console.log('t=%s', T.str(t))

T.reshape(t, [3,4])

console.log('t=%s', T.str(t))

let nd = T.tensor2ndarray(t)
console.log('nd=%j', nd)

let t2 = T.ndarray2tensor(nd)
console.log('t2=%j', t2)

let t3 = T.add(t, t)
console.log('t3=%j', t3)

let t4 = T.sub(t, t)
console.log('t4=%j', t4)



