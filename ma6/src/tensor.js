const uu6 = require('../../uu6')
const T = require('./T')
const Vector = require('./Vector')

class Tensor extends Vector {
  constructor(v, shape) {
    super([])
    this.v = v
    this.shape = shape
    uu6.be(T.shapeSize(shape) === v.length)
  }
}

class RealTensor extends Vector {
  constructor(v, shape) {
    super()
    if (shape == null) { // from ndarray
      let nd = v
      let t = T.ndarray2tensor(nd)
      this.v = t.v
      this.shape = t.shape
    } else { // from { shape, v }
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
    return new Tensor(ti.v, ti.shape)
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

function tensor(v, shape) {
  return new RealTensor(v, shape)
}

module.exports = {
  tensor, Tensor, SliceTensor, RealTensor
}

/*
  slice (lo, hi) {
    return new Tensor(T.slice(this.v, this.shape, lo, hi))
  }
*/


