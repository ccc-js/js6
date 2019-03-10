const F = module.exports = {}

F.grad = function (f, v, h=0.01) {
  let len = v.length
  let u = v.slice(0)
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    let t = u[i]
    u[i] += h
    g[i] = (f(u) - f(v)) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
    u[i] = t
  }
  return g
}
