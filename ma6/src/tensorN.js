const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')

T.shapeSize = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx, lo, hi) {
  lo = lo || V.array(shape.length)
  hi = hi || shape
  let len = shape.length
  let offset = idx[0] + lo[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.slice = function (v, shape, lo, hi) {
  let dim = shape.length
  
  uu6.be(dim <= 3)
  if (dim == 1) {
    v = 
  }
}

/*
T.row = function (v, shape, i, lo, hi) {
  lo = uu6.clone(lo) || V.array(shape.length)
  hi = uu6.clone(hi) || uu6.clone(shape)
  lo[0] = lo[0] + i; hi = lo[0] + i + 1
  // let b = V.array(shape.length), e = V.array(shape.length)
  // b[0] = i; e[0] = i+1
  // let begin = T.offset(shape, b, lo, hi), end=T.offset(shape, e, lo, hi)
  return { v: v.slice(begin, end), shape: shape.slice(1) }
}
*/
/*

T.offset = function (shape, idx) {
  let len = shape.length
  let offset = idx[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i]
  }
  return offset
}

T.row = function (v, shape, i) {
  let b = V.array(shape.length), e = V.array(shape.length)
  b[0] = i; e[0] = i+1
  let begin = T.offset(shape, b), end=T.offset(shape, e)
  return { v: v.slice(begin, end), shape: shape.slice(1) }
}
*/

T.tensor2ndarray = function (v, shape, lo, hi) {
  uu6.be(uu6.is(v, 'array') && uu6.is(shape, 'array'))
  lo = lo || V.array(shape.length)
  hi = hi || uu6.clone(shape)

  if (shape.length === 1) return v.slice(lo[0], hi[0])
  let rows = shape[0]
  let nd = new Array(rows)
  for (let i=0; i<rows; i++) {
    let ti = T.row(v, shape, i)
    nd[i] = T.tensor2ndarray(ti.v, ti.shape)
  }
  return nd
} 

T.ndarray2tensor = function (nd) {
  let t = null
  if (!uu6.is(nd, 'array')) {
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
    super([])
  }
}

T.Tensor = Tensor
class RealTensor extends Tensor {
  constructor(v, shape) {
    super()
    if (shape == null) { // from ndarray
      let nd = v
      let t = T.ndarray2tensor(nd)
      this.v = t.v
      this.shape = t.shape
    } else {
      this.v = v
      this.shape = shape
      uu6.be(T.shapeSize(shape) === v.length)
    }
  }
  get(...idx) {
    return this.v[T.offset(this.shape, idx)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    this.v[T.offset(this.shape, idx)] = o
  }
  row(i) {
    let ti = T.row(this.v, this.shape, i)
    return new RealTensor(ti.v, ti.shape)
  }
  reshape(shape) {
    uu6.be(uu6.is(shape, 'array') && T.shapeSize(shape) === this.v.length)
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
  /*
  row(i) { // ??
    let i2 = i+lo[0]
    let ti = T.row(this.v, this._shape, i2)
    let begin = 
    return new RealTensor(ti.v, ti.shape)
  }*/
  reshape(shape) { throw Error('SliceTensor cannot be reshaped!')}
}

T.SliceTensor = SliceTensor

T.tensor = function (v, shape) {
  return new RealTensor(v, shape)
}

/*
  slice (lo, hi) {
    return new Tensor(T.slice(this.v, this.shape, lo, hi))
  }
*/


