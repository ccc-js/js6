const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')

T.size = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx, lo) {
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.sliceNdarray = function (v, shape, lo, hi) {
  let dim = shape.length
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]
  if (dim === 1) {
    let rv = new Array(wi2)
    for (let ri = 0, i=lo[0]; i<hi[0]; ri++, i++) rv[ri++] = v[i]
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
        let rvj = rv[ri][rj] = new Array(wk2)
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
  if (!uu6.type(nd, 'array')) {
    t = { v: nd, shape:[] }
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

class Tensor extends V.Vector {
  constructor(v, shape) {
    super()
    if (shape == null) { // from ndarray
      let nd = v
      let t = T.ndarray2tensor(nd)
      this.v = t.v
      this.shape = t.shape
    } else {
      this.v = v || new Array(T.size(shape))
      this.shape = shape
      uu6.be(T.size(shape) === v.length)
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

    this.lo = lo
    this.hi = hi
  }
  reshape(shape) {
    uu6.be(uu6.type(shape, 'array') && T.size(shape) === this.v.length)
    this.shape = shape
    return this
  }
  ndarray() {
    return T.tensor2ndarray(this.v, this.shape)
  }
  toString() {
    return uu6.json({shape, v})
  }
}

T.Tensor = Tensor

T.tensor = function (v, shape) {
  return new Tensor(v, shape)
}

/*
T.RealTensor = RealTensor
class SliceTensor extends Tensor {
  constructor(v, shape, lo, hi) {
    super(v, shape)
    this._shape = shape
    this.lo = lo
    this.hi = hi
  }
  get shape() { return V.sub(this.hi, this.lo) }
  set shape(v) { throw Error('SliceTensor cannot be reshaped!') }
  get(...idx) {
    let idx2 = V.add(idx, lo)
    return this.v[T.offset(this.shape, idx2)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    let idx2 = V.add(idx, lo)
    this.v[T.offset(this.shape, idx2)] = o
  }
  reshape(shape) { throw Error('SliceTensor cannot be reshaped!')}
}

T.SliceTensor = SliceTensor
*/


/*
class Tensor extends V.Vector {
  constructor(v, shape) {
    super([])
  }
}
*/ 