const M = module.exports = {}
const V = require('./vector')

M.logp = function(n) {
  let a = V.steps(1, n, 1)
  let la = V.log(a)
	return V.sum(la)
}

// 傳回多項分布的 log 值！ log( (n!)/(x1!x2!...xk!) p1^x1 p2^x2 ... pk^xk )
// = [log(n)+...+log(1)]-[log(x1)...]+....+x1*log(p1)+...+xk*log(pk)
M.xplog = function(x, p) {
  var n = V.sum(x)
  var r = M.logp(n)
  let len = x.length
  for (let i=0; i<len; i++) r -= M.logp(x[i]);
  return r + V.dot(x, V.log(p))
}
