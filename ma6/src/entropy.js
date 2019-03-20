const M = module.exports = {}

M.logp = function(n) {
	return M.steps(1,n,1).log().sum();
}

// 傳回多項分布的 log 值！ log( (n!)/(x1!x2!...xk!) p1^x1 p2^x2 ... pk^xk )
// = [log(n)+...+log(1)]-[log(x1)...]+....+x1*log(p1)+...+xk*log(pk)
M.xplog = function(x, p) {
  var n = x.sum();
  var r = M.logp(n);
  for (var i in x) r -= M.logp(x[i]);
  return r + x.dot(p.log());
}