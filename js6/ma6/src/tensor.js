// tensor = {r, i, shape} ，若 i!=[] 則是複數張量
const T = module.exports = {}

const uu6 = require('../../uu6')
const {be} = uu6
const V = require('./vector')
const M = require('./matrix')
const C = require('./complex')
const RA = require('./ratio') 

T.new = function (o) {
  return {r:o.r||[], i:o.i||[], shape:o.shape}
}

T.dim = function (o) { return o.shape.length }

T.size = function (o) { return V.product(o.shape) }

T.offset = function (o, idx, lo) {
  let {r, shape} = o
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset * shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.get = function (o, ...idx) {
  let j = T.offset(o, idx)
  return {r: o.r[j], i: o.i[j] || 0}
}

T.set = function (o, ...idx) {
  let v = idx.pop() // idx 的最後一個是 value
  let j = T.offset(o.shape, idx)
  if (typeof v === 'number') {
    o.r[j] = v
  } else {
    o.r[j] = v.r; o.i[j] = v.i
  }
}

T.reshape = function (o, shape) {
  be(T.size(o) === T.size({r:0, shape}))
  o.shape = shape
  return o
}

function slice1d(v, shape, lo, hi) {
  if (v == null) return
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]
  let rv = new Array(wi2)
  for (let ri = 0, i=lo[0]; i<hi[0]; ri++, i++) rv[ri] = v[i]
  return rv
}

function slice2d(v, shape, lo, hi) {
  if (v == null) return
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]
  let rv = new Array(wi2)
  for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
    let rvi = rv[ri] = new Array(wj2)
    for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
      rvi[rj] = v[i*wj+j]
    }
  }
  return rv
}

function slice3d(v, shape, lo, hi) {
  if (v == null) return
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]
  let rv = new Array(wi2)
  for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
    let rvi = rv[ri] = new Array(wj2)
    for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
      let rvj = rvi[rj] = new Array(wk2)
      for (let rk=0, k=lo[2]; k<hi[2]; rk++, k++) {
        rvj[rk] = v[(i*wj+j)*wk+k]
      }
    }
  }
  return rv
}

T.sliceNdarray = function (o, lo, hi) {
  let {r, i, shape} = o
  let dim = shape.length
  if (dim === 1) return {r: slice1d(r, shape, lo, hi), i: slice1d(i, shape, lo, hi)}
  if (dim === 2) return {r: slice2d(r, shape, lo, hi), i: slice2d(i, shape, lo, hi)}
  if (dim === 3) return {r: slice3d(r, shape, lo, hi), i: slice3d(i, shape, lo, hi)}
  throw Error('sliceNdarray():dim > 3')
}

T.tensor2ndarray = T.ndarray = function (o) {
  return T.sliceNdarray(o, V.array(o.shape.length), o.shape).r
}

T.ndarray2tensor = function (nd) {
  let t = null
  if (!Array.isArray(nd[0])) {
    t = { r: nd, shape: [nd.length] }
    return t
  }
  let rows = nd.length
  uu6.be(rows > 0)
  let r = [], cols = nd[0].length
  for (let i=0; i<rows; i++) {
    uu6.be(nd[i].length === cols)
    t = T.ndarray2tensor(nd[i])
    r = r.concat(t.r)
  }
  t.shape.unshift(nd.length)
  return {r: r, i:[], shape: t.shape }
}

T.str = function (o) {
  return uu6.json(T.tensor2ndarray(o))
}

T.op1 = function (a, op) {
  return {
    r: V[op](a.r),
    shape: a.shape,
  }
}
T.neg = (a, b) => T.op1(a, 'neg')

// ============================= op2 ==================================
function toC(o) {
  if (o.r != null && o.i != null) return o
  // if (typeof o === 'number') return {r:o, i:0}
  if (!Array.isArray(o)) return { r:o, i:0 } // 基本型態
  return {r:o, i:[]}
}

T.op2 = function (a, b, op) {
  a = toC(a); b = toC(b)
  return {
    r: V[op](a.r, b.r),
    i: V[op](a.i, b.i),
    shape: a.shape || b.shape
  }
}

T.add = (a, b) => T.op2(a, b, 'add')
T.sub = (a, b) => T.op2(a, b, 'sub')
T.mod = (a, b) => T.op2(a, b, 'mod')
T.and = (a, b) => T.op2(a, b, 'and')
T.or  = (a, b) => T.op2(a, b, 'or')
T.xor = (a, b) => T.op2(a, b, 'xor')
T.band= (a, b) => T.op2(a, b, 'band')
T.bor = (a, b) => T.op2(a, b, 'bor')
T.bxor= (a, b) => T.op2(a, b, 'bxor')
T.eq  = (a, b) => T.op2(a, b, 'eq')
T.neq = (a, b) => T.op2(a, b, 'neq')
T.lt  = (a, b) => T.op2(a, b, 'lt')
T.gt  = (a, b) => T.op2(a, b, 'gt')
T.leq = (a, b) => T.op2(a, b, 'leq')
T.geq = (a, b) => T.op2(a, b, 'geq')

T.cOp2 = function (a, b, op) {
  a = toC(a); b = toC(b)
  let aT = (a.shape != null), bT = (b.shape != null)
  let Cop = C[op]
  if (!aT && !bT) return Cop(a, b)
  if (a.i.length === 0 && b.i.length === 0) return {r:T.op2(a.r, b.r, op), i:[], shape: a.shape}
  let len = a.r.length || b.r.length, t = T.new({r:new Array(len), i:new Array(len), shape:a.shape || b.shape})
  let tr = t.r, ti = t.i, ar=a.r, ai=a.i, br=b.r, bi=b.i
  // console.log('a=%j b=%j ar=%j ai=%j br=%j bi=%j', a, b, ar, ai, br, bi)
  for (let j=0; j<len; j++) {
    let aj = aT ? {r: ar[j]||0, i: ai[j]||0} : a
    let bj = bT ? {r: br[j]||0, i: bi[j]||0} : b 
    let tj = Cop(aj, bj)
    // console.log('aj=%j bj=%j tj=%j', aj, bj, tj)
    tr[j] = tj.r; ti[j] = tj.i
  }
  return t
}

T.mul = function (a, b) { return T.cOp2(a, b, 'mul') }
T.pow = function (a, b) { return T.cOp2(a, b, 'pow') }
T.div = function (a, b) { return T.cOp2(a, b, 'div') }

// ============================= matrix ==================================
let beMatrix = T.beMatrix = function (o) {
  // let d = T.dim(o)
  // console.log('beMatrix:d=%d', d)
  uu6.be(T.dim(o) == 2)
}
T.rows = function (o) { beMatrix(o); return o.shape[0] }
T.cols = function (o) { beMatrix(o); return o.shape[1] }
T.rowSum = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o)
  let s = V.array(rows), r = o.r
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      s[i] += r[i*cols+j]
    }
  }
  return {r:s, shape:[rows]}
}

T.rowMean = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o);
  return {r: V.div(T.rowSum(o).r, cols), shape:[rows] }
}

T.colSum = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o)
  let s = V.array(cols), r = o.r
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      s[j] += r[i*cols+j]
    }
  }
  return {r:s, shape:[cols]}
}

T.colMean = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o);
  return {r: V.div(T.colSum(o), rows), shape: [cols] }
}

T.transpose = function (o) { beMatrix(o)
  let rows = T.rows(o), cols=T.cols(o)
  let t = T.new({shape:[cols, rows], r: V.array(rows*cols) })
  for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
      t.r[j*rows+i] = o.r[i*cols+j]
    }
  }
  return t
}

T.mdot = function (a, b) { beMatrix(a); beMatrix(b)
  let arows = T.rows(a), acols=T.cols(a), bcols = T.cols(b)
  let t = T.new({shape:[arows, bcols], r: V.array(arows*bcols) })
  for (let i = 0; i < arows; i++) {
    for (let j = 0; j < acols; j++) {
      for (let k=0; k<bcols; k++) {
        t.r[i*acols+k] += a.r[i*acols+j] * b.r[j*bcols+k]
      }
    }
  }
  return t
}

T.diag = function (o) { beMatrix(o)
  let a = o, ar = a.r, [rows, cols] = a.shape
  let r = V.array(rows)
  for (let i = 0; i < rows; i++) {
    r[i] = ar[i][i]
  }
  return r
}

T.inv = function (o) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  let ia = M.inv(a)
  return T.ndarray2tensor(ia)
}

T.det = function (o) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  return M.det(a)
}

T.lu = function (o) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  return M.lu(a)
}

T.svd = function (o) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  return M.svd(a)
}

T.solve = function (o, b) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  return M.solve(a, b)
}
