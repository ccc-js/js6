// const {oo} = require('./oo')
const uu6 = require('../../../js6/uu6')
const RA = require('./ratio')
const C = require('./complex')
const V = require('./vector')
const ND = require('./ndarray')
const M = require('./matrix')
const T = require('./tensor')
const R = require('./R')
const F = require('./function')
const O = module.exports = {}

V.toTensor = T.ndarray2tensor

let all = function (o, keys) {
  let len = keys.length
  for (let i=0; i<len; i++) {
    let key = keys[i]
    if (o[key] == null) return false
  }
  return true
}

let parse = function (s) {
  let r = null
  if ((r = RA.ratio(s)) != null) return {type:'ratio', v:r}
  if ((r = C.complex(s)) != null) return {type:'complex', v:r}
  return {type:'string', v:s}
}

let obj = function (o) {
  if (o.type != null) return o
  if (o instanceof OO) return o
  let t = typeof o, r = null
  if (t === 'string') return parse(o)
  if (t !== 'object') return {type:t, v:o}
  if (Array.isArray(o)) {
    return (Array.isArray(o[0])) ? {type:'ndarray', v:o} : {type:'vector', v:o}
    // return {type:'tensor', v:T.new({r:o, shape:[o.length]})}
  }
  if (all(o, ['a', 'b'])) return {type:'ratio', v:o}
  if (all(o, ['r', 'shape'])) return {type:'tensor', v:T.new(o)}
  if (all(o, ['r', 'i'])) return {type:'complex', v:o}
  return {type:'unknown', v:o}
  // throw Error('oo: fail! o='+JSON.stringify(o))
}
/*
let type = function (o) {
  return obj(o).type
}
*/

function op2(x, y, op) {
  let {v:xv, type:xt} = obj(x), {v:yv, type:yt} = obj(y)
  // let {v:xv, type:xt} = O.obj(x), {v:yv, type:yt} = O.obj(y)
  if (xt === 'ratio' && yt === 'ratio') return RA[op](xv,yv) // 兩者均為 ratio, 用 ratio 去運算
  if (xt === 'ratio') xv = RA.number(xv) // ratio 轉換為 number
  if (yt === 'ratio') yv = RA.number(yv) // ratio 轉換為 number
  if (xt==='complex' && yt==='complex') return C[op](xv,yv) // 兩者均為複數，用 complex 去運算
  if (xt==='number' && yt==='number') return V[op](xv,yv) // 兩者均為 number，用 V.op(x,y) 去運算
  if (xt==='vector' && yt==='vector') return V[op](xv,yv) // 兩者均為 vector，用 V.op(x,y) 去運算
  if (xt==='ndarray' && yt==='ndarray') return ND[op](xv,yv) // 兩者均為 ndarray，用 ND.op(x,y) 去運算
  if (xt==='tensor' || yt==='tensor') return T[op](xv,yv) // 至少有一個為 tensor, 呼叫 T.op(x,y) 去運算
}

let call = function (o, method, ...args) {
  let len = args.length
  let vargs = new Array(len)
  let oargs = new Array(len)
  for (let i=0; i<len; i++) {
    let ao = obj(args[i])
    oargs[i] = ao
    vargs[i] = ao.v
  }
  // console.log('vargs=%j', vargs)
  var r = null
  if (['add', 'sub', 'mul', 'div', 'pow'].indexOf(method) >= 0) {
    r = op2(oargs[0], oargs[1], method)
  } else {
    // console.log('args=%j', args)
    r = o[method](...args)
  }
  if (r == null) return
  // if (r == null) r = oargs[0] // if no return, return this
  let ro = oo(r)
  console.log('ro=%j', ro)
  return ro
}

class OO {
  constructor(v) {
    let o = obj(v)
    this.v = o.v
    this.type = o.type 
  }

  // add() { return call(C, 'add', this, ...arguments) }

  toString(digits=4) {
    var {type, v} = this
    console.log('v=%j', v)
    switch (type) {
      case 'number': return v.toFixed(digits)
      case 'ratio': return RA.str(v)
      case 'complex': return C.str(v)
      case 'tensor': return T.str(v)
      default: throw Error('str: type='+type+' not found!')
    }
  }
}

let oo = function (v) {
  if (v instanceof OO) return v
  return new OO(v)
}

let ooMix = function (...args) {
  for (let source of args) {
    Object.getOwnPropertyNames(source).forEach(function(property) {
      let s = source[property]
      let t = (typeof s === 'function') ? function () { return oo(s(...arguments)) } : oo(s)
      O[property] = t
      if (typeof s === 'function') { // ex: call(C, 'add', this.v, y)
        OO.prototype[property] = function () { return call(source, property, this.v, ...arguments) }
      }
    })
  }
}

ooMix(C, RA, M, V, ND, T, R, F,
  // pure function
  require('./entropy'),
  require('./optimize'),
  require('./calculus'),
  require('./ode'),
  // pure member
  require('./constant')
)
/*
let callMix = function (source, ...args) {
  for (let source of args) {
    Object.getOwnPropertyNames(source).forEach(function(property) {
      let s = source[property]
      if (typeof s === 'function') {
        OO.prototype[property] = function () { return oo(source[property](this.v, ...arguments)) }
      }
    })
  }
}
*/
/* 其他: 

class

  probability.js <= probFunction.js
  set.js
  series.js

得進一步包裝

  transform.js (=> tensor.js)

*/

O.oo = oo

/*
function op2(x, y, op) {
  let {v:xv, type:xt} = O.obj(x), {v:yv, type:yt} = O.obj(y)
  if (xt === 'ratio' && yt === 'ratio') return oo(RA[op](xv,yv)) // 兩者均為 ratio, 用 ratio 去運算
  if (xt === 'ratio') xv = RA.number(xv) // ratio 轉換為 number
  if (yt === 'ratio') yv = RA.number(yv) // ratio 轉換為 number
  if (xt==='complex' && yt==='complex') return oo(C[op](xv,yv)) // 兩者均為複數，用 complex 去運算
  if (xt==='number' && yt==='number') return oo(V[op](xv,yv)) // 兩者均為 number，用 V.op(x,y) 去運算
  if (xt==='tensor' || yt==='tensor') return oo(T[op](xv,yv)) // 至少有一個為 tensor, 呼叫 T.op(x,y) 去運算
}

function op1(o, op) {
  let r = T[op](o.v)
  try { return new OO(r) } catch (e) { return r }
}
*/