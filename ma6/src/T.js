const uu6 = require('../../uu6')
const V = require('./V')
const T = module.exports = {}

T.shapeSize = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx) {
  let len = shape.length
  let offset = idx[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i]
  }
  return offset
}

T.row = function (v, shape, i) {
  let b = V.new(shape.length), e = V.new(shape.length)
  b[0] = i; e[0] = i+1
  let begin = T.offset(shape, b), end=T.offset(shape, e)
  return { v: v.slice(begin, end), shape: shape.slice(1) }
}


T.tensor2ndarray = function (v, shape) {
  uu6.be(uu6.is(v, 'array') && uu6.is(shape, 'array'))
  if (shape.length === 1) return v.slice(0)
  let rows = shape[0]
  let shape2 = shape.slice(1)
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

/*

/*
尚未成功

D:\ccc\js\js6\ma6\src\T.js:24
  return { v: v.slice(begin, end), shape: shape.slice(1) }
                                                ^

TypeError: shape.slice is not a function
    at Object.T.row (D:\ccc\js\js6\ma6\src\T.js:24:49)
    at Object.T.slice (D:\ccc\js\js6\ma6\src\T.js:40:24)
    at Tensor.slice (D:\ccc\js\js6\ma6\src\Tensor.js:32:25)
    at Object.<anonymous> (D:\ccc\js\js6\ma6\ex\Tensor1.js:19:39)
    at Module._compile (internal/modules/cjs/loader.js:707:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:718:10)
    at Module.load (internal/modules/cjs/loader.js:605:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:544:12)
    at Function.Module._load (internal/modules/cjs/loader.js:536:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:760:12)
*/
/*
// 尚未成功，會 stackoverflow
T.slice = function (v, shape, lo, hi) {
  console.log('v=', v, 'shape=', shape, 'lo=', lo, 'hi=', hi)
  uu6.be(uu6.is(shape, 'array') && uu6.is(v, 'array'))
  if (shape.length === 1) {
    let t = {v: v.slice(lo[0], hi[0]), shape:[hi[0]-lo[0]]}
    console.log('t=', t)
    return t
  }
  let r = []
  let l = lo[0], h = hi[0]
  let lo2 = lo.slice(1), hi2 = hi.slice(1)
  console.log('lo2=', lo2, 'hi2=', hi2)
  for (let k=l; k<h; k++) {
    let tk = T.slice(T.row(v, k), shape, concat(lo2), concat(hi2))
    console.log('tk=', tk)
    tk.shape.shift()
    r.concat(tk)
  }
  let shape2 = V.sub(hi, lo)
  console.log('r=', r, 'shape2=', shape2)
  return {v: r, shape: shape2 }
}
*/
/*
T.tensor2matrix = function (v, shape) {
  let m = []
  let [rows, cols] = shape
  for (let i=0; i<rows; i++) {
    let mi = new Array(cols)
    for (let j=0; j<cols; j++) {
      mi[j] = v[i*cols+j]
    }
    m.push(mi)
  }
  return m
}
*/