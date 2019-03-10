const nj6 = module.exports = require('numjs')
const p= nj6.NdArray.prototype

p.str = p.toString
p.sub = p.subtract
p.mul = p.multiply
p.div = p.divide
p.pow = p.power // 似乎沒有 power 函數
p.neg = p.negative
p.sd  = p.std
p.tr  = p.transpose
p.eq  = p.equal
p.rot = p.rot90 // 似乎沒有 rot90 函數
