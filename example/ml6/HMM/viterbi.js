// 參考： https://zh.wikipedia.org/wiki/%E7%BB%B4%E7%89%B9%E6%AF%94%E7%AE%97%E6%B3%95
const ml6 = require('../../../js6/ml6')

// N 0.6 => 喵 0.4 | 汪 0.6
// V 0.4 => 喵 0.5 | 汪 0.5
//    N   V
// N  0.3 0.7
// V  0.8 0.2
const P = {
  'N': 0.6,
  'V': 0.4,
  'N=>N': 0.3,
  'N=>V': 0.7,
  'V=>N': 0.8,
  'V=>V': 0.2,
  'N=>喵': 0.4,
  'N=>汪': 0.6,
  'V=>喵': 0.5,
  'V=>汪': 0.5,
}


let {prob, path} = ml6.viterbi('喵 喵 汪'.split(' '), ['N', 'V'], P)
console.log('prob=%d path=%j＝最可能的隱序列', prob, path)