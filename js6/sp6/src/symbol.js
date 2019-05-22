const S = module.exports = require('./symDiffer')
const uu6 = require('../../uu6')

S.call = function (exp, context) {
  let c = {...context}, $r = null // 加 $ 是為了避免 exp 裏有變數 r 的名稱。
  uu6.mixin(c, Math)
  eval(`with (c) { $r = ${exp} }`)
  return $r
}
