const F = module.exports = {}

F.grad = function (f, v, h=0.01) {
  let len = v.length, fv = f(v)
  let v2 = v.slce(0)
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    let t = v2[i]
    v2[i] += h
    g[i] = (f(v2) - fv) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
    v2[i] = t
  }
  return new Vector(g)
}
