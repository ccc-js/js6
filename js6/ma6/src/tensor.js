const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')
const M   = require('./matrix')

T.size = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx, lo) {
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset * shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.sliceNdarray = function (v, shape, lo, hi) {
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

T.tensor2ndarray = function (v, shape, lo, hi) {
  return T.sliceNdarray(v, shape, V.array(shape.length), shape)
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

class Tensor extends V.Vector { // 
  // ================== Tensor =========================
  constructor(v, shape) {
    super()
    uu6.be(v || shape)
    if (v && !shape) {
      let nd = v
      let t = T.ndarray2tensor(nd)
      this.v = t.v
      this.shape = t.shape  
    } else {
      this.v = v || uu6.array(T.size(shape))
      this.shape = shape || [this.v.length]
      uu6.be(T.size(this.shape) === this.v.length)
    }
  }
  get(...idx) {
    return this.v[T.offset(this.shape, idx)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    this.v[T.offset(this.shape, idx)] = o
  }
  slice(v, shape, lo, hi) {
    this.lo = (!lo) ? lo : V.add(this.lo, lo)
    this.hi = (!lo) ? hi : V.add(this.lo, hi)
  }
  reshape(shape) {
    uu6.be(uu6.type(shape, 'array') && T.size(shape) === this.v.length)
    this.shape = shape
    return this
  }
  ndarray() {
    return T.tensor2ndarray(this.v, this.shape)
  }
  clone(v) {
    let vt = v || this.v
    return new Tensor(vt.slice(0), this.shape)
  }
  toString() {
    return uu6.json(this.ndarray())
  }
  dim() { return this.shape.length }

  // ================== Matrix =============================
  beMatrix() { uu6.be(this.dim() == 2) }
  rows () { this.beMatrix(); return this.shape[0] }
  cols () { this.beMatrix(); return this.shape[1] }

  rowSum () { this.beMatrix();
    let rows = this.rows(), cols = this.cols()
    let s = V.array(rows), v = this.v
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        s[i] += v[i*cols+j]
      }
    }
    return new Tensor(s)
  }
  rowMean() { return this.rowSum().divc(this.cols()) }
  
  colSum () { this.beMatrix();
    let rows = this.rows(), cols = this.cols()
    let s = V.array(cols), v = this.v
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        s[j] += v[i*cols+j]
      }
    }
    return Tensor(s)
  }
  colMean() { return this.colSum().divc(this.rows()) }

  transpose() { this.beMatrix();
    let a = this.ndarray()
    return new Tensor(M.transpose(a))
  }

  dot (b) { this.beMatrix();
    let ax = this.ndarray(), bx = b.ndarray()
    return new Tensor(M.dot(ax, bx))
  }

  diag () { this.beMatrix();
    let a = this, av = a.v, [rows, cols] = a.shape
    let r = new Tensor(a.v, a.shape), rv = r.v
    let v = V.array(rows)
    for (let i = 0; i < rows; i++) {
      v[i] = av[i][i]
    }
    return v
  }

  inv () { this.beMatrix();
    let a = this.ndarray()
    let ia = M.inv(a)
    return new Tensor(ia)
  }

  det() { this.beMatrix();
    let a = this.ndarray()
    return M.det(a)
  }

  lu() { this.beMatrix();
    let a = this.ndarray()
    return M.lu(a)
  }

  svd() { this.beMatrix();
    let a = this.ndarray()
    return M.svd(a)
  }

  solve(b) { this.beMatrix();
    let a = this.ndarray()
    return M.solve(a, b)
  }
}

T.Tensor = Tensor
T.Matrix = Tensor

T.tensor = function (v, shape) {
  return new Tensor(v, shape)
}
