const uu6 = require('../../../js6/uu6')
const O = module.exports = {}
const V = require('./vector')
uu6.mixin(O, V)
const RA = require('./ratio')
const C = require('./complex')
const T = require('./tensor')

let has = uu6.contain

O.all = function (o, keys) {
  let len = keys.length
  for (let i=0; i<len; i++) {
    let key = keys[i]
    if (o[key] == null) return false
  }
  return true
}

O.parse = function (s) {
  let r = null
  if ((r = RA.ratio(s)) != null) return {type:'ratio', v:r}
  if ((r = C.complex(s)) != null) return {type:'complex', v:r}
  throw Error('parse: fail! s='+s)
}

O.obj = function (o) {
  if (o.type != null || o instanceof OO) return o
  let t = typeof o, r = null
  if (t === 'string') return O.parse(o)
  if (t !== 'object') return {type:t, v:o}
  if (Array.isArray(o)) return {type:'tensor', v:{v:o, shape:[o.length]}}
  if (O.all(o, ['r', 'i'])) return {type:'complex', v:o}
  if (O.all(o, ['a', 'b'])) return {type:'ratio', v:o}
  if (O.all(o, ['v', 'shape'])) return {type:'tensor', v:o}
  console.log('obj:o=%j', o)
  throw Error('oo: fail! o='+o)
}

let oo = O.oo = function (v) {
  if (v instanceof OO) return v
  return new OO(v)
}

O.type = function (o) {
  return O.obj(o).type
}

// 假如 tensor 有 iv 元素，那麼就代表是複數張量
// 直接擴充 vector.js ，改為 tensor.js 然後支援退化版的 vector (沒有 shape 的狀況)。
function op2(x, y, op) {
  /*
  if (isComplex(x) || isComplex(y)) {
    x = toComplex(x); y = toComplex(y)
    return C.add(x,y)
  }
  */
  var xshape, yshape
  let {v:xv, type:xt} = O.obj(x), {v:yv, type:yt} = O.obj(y)
  // console.log('xv=%j yv=%j xt=%s yt=%s', xv, yv, xt, yt)
  if (xt === 'ratio' && yt === 'ratio') return oo(RA[op](xv,yv))
  if (xt==='complex' && yt==='complex') return oo(C[op](xv,yv))
  if (xt==='number' && yt==='number') return oo(V[op](xv,yv))
  let nv = ['number', 'tensor']
  if (xt === 'tensor') { xshape = xv.shape; xv = xv.v }
  if (yt === 'tensor') { yshape = yv.shape; yv = yv.v }
  if (has(nv, xt) && has(nv, yt)) return oo({v:V[op](xv,yv), shape:xshape||yshape})
}

class OO {
  constructor(v) {
    let o = O.obj(v)
    this.v = o.v
    this.type = o.type
  }
  add(b) { return op2(this, b, 'add') }
  sub(b) { return op2(this, b, 'sub') }
  mul(b) { return op2(this, b, 'mul') }
  div(b) { return op2(this, b, 'div') }
  mod(b) { return op2(this, b, 'mod') }
  pow(b) { return op2(this, b, 'pow') }
  and(b) { return op2(this, b, 'and') }
  or(b)  { return op2(this, b, 'or') }
  xor(b) { return op2(this, b, 'xor') }
  band(b) { return op2(this, b, 'band') }
  bor(b)  { return op2(this, b, 'bor') }
  bxor(b) { return op2(this, b, 'bxor') }
  eq(b)  { return op2(this, b, 'eq') }
  neq(b) { return op2(this, b, 'neq') }
  lt(b)  { return op2(this, b, 'lt') }
  gt(b)  { return op2(this, b, 'gt') }
  leq(b) { return op2(this, b, 'leq') }
  geq(b) { return op2(this, b, 'geq') }
  toString(digits=4) {
    var {type, v} = this
    switch (type) {
      case 'number': return v.toFixed(digits)
      case 'ratio': return RA.str(v)
      case 'complex': return C.str(v)
      case 'tensor': return T.str(v)
      default: throw Error('str: type='+type+' not found!')
    }
  }
}

/*
O.str = function (o, digits=4) {
  var {type, v} = obj(o)
  switch (type) {
    case 'number': return v.toFixed(digits)
    case 'ratio': return RA.str(v)
    case 'complex': return C.str(v)
    case 'tensor': return T.str(v)
    default: throw Error('str: type='+type+' not found!')
  }
}
*/

/*
O.add = (x,y)=>op2(x,y,'add')
O.sub = (x,y)=>op2(x,y,'sub')
O.mul = (x,y)=>op2(x,y,'mul')
O.div = (x,y)=>op2(x,y,'div')
O.mod = (x,y)=>op2(x,y,'mod')
O.pow = (x,y)=>op2(x,y,'pow')

O.and = (x,y)=>op2(x,y,'and')
O.or  = (x,y)=>op2(x,y,'or')
*/