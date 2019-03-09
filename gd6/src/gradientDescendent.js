// 使用梯度下降法尋找函數最低點
// M: module with call, grad, isBetter, apply
const gradientDescendent = function (plugin, p0, step=0.01) {
  let p = p0
  console.log('p=', p.toString())
  while (true) {
    console.log('p=', p.toString(), 'f(p)=', plugin.call(p))
    let g = plugin.grad(p) // 計算梯度 gp
    console.log('  g=', g.toString())
    if (!plugin.isBetter(g, p)) break
    p = plugin.apply(g, p, step)
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent