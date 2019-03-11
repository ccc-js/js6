const Tensor = require('./tensor')
const V = require('./V')

module.exports = class SliceTensor extends Tensor {
  constructor(v, shape, lo, hi) {
    super(v, shape)
    this.lo = lo
    this.hi = hi
  }
  get shape() { return this.shape }
  set v(c) { } // 常數不能事後設定值
  get(...idx) {
    let idx2 = V.add(idx, lo)
    return this.v[T.offset(this.shape, idx2)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    let idx2 = V.add(idx, lo)
    this.v[T.offset(this.shape, idx2)] = o
  }
  row(i) {
    let i2 = i+lo[0]
    let ti = T.row(this.v, this.shape, i)
    return new Tensor(ti.v, ti.shape)
  }
  reshape(shape) { throw Error('SliceTensor cannot be reshaped!')}
}