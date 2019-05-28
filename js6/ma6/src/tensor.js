const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')
const M   = require('./matrix')

T.dim = function (o) { return o.shape.length }

T.size = function (o) {
  return V.product(o.shape)
}

T.offset = function (o, idx, lo) {
  let {v, shape} = o
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset * shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.get = function (o, ...idx) {
  return o.v[T.offset(o, idx)]
}

T.set = function (o, ...idx) {
  let item = idx.pop()
  o.v[T.offset(o.shape, idx)] = item
}

T.reshape = function (o, shape) {
  o.shape = shape
}

T.sliceNdarray = function (o, lo, hi) {
  let {v, shape} = o
  let dim = shape.length
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]

  if (dim === 1) {
    let rv = new Array(wi2)
    for (let ri = 0, i=lo[0]; i<hi[0]; ri++, i++) rv[ri] = v[i]
    return rv
  }
  if (dim === 2) {
    let rv = new Array(wi2)
    for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
      let rvi = rv[ri] = new Array(wj2)
      for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
        rvi[rj] = v[i*wj+j]
      }
    }
    return rv
  }

  if (dim === 3) {
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
  throw Error('sliceNdarray():dim > 3')
}

T.tensor2ndarray = function (o) {
  return T.sliceNdarray(o, V.array(o.shape.length), o.shape)
}

T.ndarray2tensor = function (nd) {
  let t = null
  if (!Array.isArray(nd[0])) {
    t = { v: nd, shape: [nd.length] }
    return t
  }
  let rows = nd.length
  uu6.be(rows > 0)
  let v = [], cols = nd[0].length
  for (let i=0; i<rows; i++) {
    uu6.be(nd[i].length === cols)
    t = T.ndarray2tensor(nd[i])
    v = v.concat(t.v)
  }
  t.shape.unshift(nd.length)
  return {v: v, shape: t.shape }
}

T.str = function (o) {
  return uu6.json(T.tensor2ndarray(o))
}

// ============================= vector ==================================
T.op2 = function (a, b, op) { return {v: V[op](a.v, b.v), shape: a.shape || b.shape}}
T.add = (a, b) => T.op2(a, b, 'add')
T.sub = (a, b) => T.op2(a, b, 'sub')
T.mul = (a, b) => T.op2(a, b, 'mul')
T.div = (a, b) => T.op2(a, b, 'div')
T.mod = (a, b) => T.op2(a, b, 'mod')
T.pow = (a, b) => T.op2(a, b, 'pow')
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

// ============================= matrix ==================================
let beMatrix = T.beMatrix = function (o) { uu6.be(T.dim(o) == 2) }
T.rows = function (o) { beMatrix(o); return o.shape[0] }
T.cols = function (o) { beMatrix(o); return o.shape[1] }
T.rowSum = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o)
  let s = V.array(rows), v = o.v
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      s[i] += v[i*cols+j]
    }
  }
  return {v:s, shape:[rows]}
}

T.rowMean = function (o) { beMatrix(o)
  let cols = T.cols(o);
  return {v: V.div(T.rowSum(o).v, cols), shape:[cols] }
}

T.colSum = function (o) { beMatrix(o)
  let rows = T.rows(o), cols = T.cols(o)
  let s = V.array(cols), v = o.v
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      s[j] += v[i*cols+j]
    }
  }
  return {v:s, shape:[cols]}
}
T.colMean = function (o) { beMatrix(o)
  return V.div(T.colSum(o), T.rows(o))
}

T.transpose = function (o) { beMatrix(o)
  let a = T.tensor2ndarray(o)
  return T.ndarray2tensor(M.transpose(a))
}

T.mdot = function (a, b) { beMatrix(a)
  let ax = T.tensor2ndarray(a), bx = T.tensor2ndarray(b)
  return T.ndarray2tensor(M.dot(ax, bx))
}

T.diag = function (o) { beMatrix(o)
  let a = o, av = a.v, [rows, cols] = a.shape
  let v = V.array(rows)
  for (let i = 0; i < rows; i++) {
    v[i] = av[i][i]
  }
  return v
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
