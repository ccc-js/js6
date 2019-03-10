// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, p0, step=0.01, gap=0.0001) {
  let p = p0
  console.log('p=', p.toString())
  while (true) {
    let e = f(p)
    console.log('p=', p.toString(), 'f(p)=', f(p))
    let g = p.grad(f) // 計算梯度 gp
    console.log('  g=', g.toString())
    let d = g.mulc(-1*step)
    // console.log('d=', d.toString())
    let p2 = p.add(d)
    let e2 = f(p2)
    if (e2 > e - gap) break
    p = p2
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent
