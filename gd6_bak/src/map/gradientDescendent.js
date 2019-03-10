// 使用梯度下降法尋找函數最低點
// M: module with call, grad, isBetter, apply
const gradientDescendent = function (M, p0, step=0.01) {
  let p = p0
  // console.log('p=', p.json())
  while (true) {
    console.log('p=', p.json(), 'f(p)=', M.call(p))
    let g = M.grad(p) // 計算梯度 gp
    console.log('  g=', g.json())
    if (!M.isBetter(g, p)) break
    p = M.apply(g, p, step)
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent