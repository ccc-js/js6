const uu6 = require('../../../js6/uu6')
const O = module.exports = {}
const V = require('./vector')
uu6.mixin(O, V)
const RA = require('./ratio')
const C = require('./complex')
const T = require('./tensor')

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
  if (Array.isArray(o)) return {type:'tensor', v:T.new({r:o, shape:[o.length]})}
  if (O.all(o, ['a', 'b'])) return {type:'ratio', v:o}
  if (O.all(o, ['r', 'shape'])) return {type:'tensor', v:T.new(o)}
  if (O.all(o, ['r', 'i'])) return {type:'complex', v:o}
  throw Error('oo: fail! o='+JSON.stringify(o))
}

let oo = O.oo = function (v) {
  if (v instanceof OO) return v
  return new OO(v)
}

O.type = function (o) {
  return O.obj(o).type
}

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

class OO {
  constructor(v) {
    let o = O.obj(v)
    this.v = o.v
    this.type = o.type 
  }
  // basic operation : op1
  neg() { return op1(this, 'neg') }
  // basic operation : op2
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
  // tensor
  get(...idx) { return T.get(this.v, ...idx) }
  reshape(shape) { T.reshape(this.v, shape); return this }
  ndarray() { return T.tensor2ndarray(this.v) }

  // vector
  hist(from, to, step) { return V.hist(this.v.r, from, to, step) }

  // matrix : op1
  diag() { return op1(this, 'diag') }
  inv() { return op1(this, 'inv') }
  transpose() { return op1(this, 'transpose') }
  det() { return op1(this, 'det') }
  lu() { return op1(this, 'lu') }
  svd() { return op1(this, 'svd') }
  rows() { return op1(this, 'rows') }
  cols() { return op1(this, 'cols') }
  rowSum() { return op1(this, 'rowSum') }
  rowMean() { return op1(this, 'rowMean') }
  colSum() { return op1(this, 'colSum') }
  colMean() { return op1(this, 'colMean') }
  // matrix : op2
  mdot(b) { return op2(this, b, 'mdot') }
  solve(b) { return op2(this, b, 'solve') }

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
