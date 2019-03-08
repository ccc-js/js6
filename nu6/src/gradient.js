const G = module.exports = {}

const uu6 = require('../../uu6')
const FObject = require('./FObject')
const P = require('./point')

// 函數 f 對變數 k 的偏微分: df(p) / dk
G.df = function (f, p, k, h=0.01) {
  let p1 = uu6.clone(p)
  p1[k] += h
  return (f(p1) - f(p)) / h
}

// 函數 f 在點 p 上的梯度	∇f(p)
G.grad = function (f, p) {
  let gp = {}
  for (let k in p) {
    gp[k] = G.df(f, p, k) // 對變數 k 取偏導數後，放入梯度向量 gp 中
  }
  return gp
}

// 使用梯度下降法尋找函數最低點
G.gradientDescendent = function (f, p0, step=0.01) {
  if (typeof f === 'function') f = new FObject(f)
  let p = uu6.clone(p0)
  while (true) {
    console.log('p=', uu6.json(p), 'f(p)=', f.call(p))
    let gp = f.grad(p) // 計算梯度 gp
    let norm = P.norm(gp) // norm = 梯度的長度 (步伐大小)
    console.log('  gp=', gp, ' norm=', norm)
    if (norm < 0.00001) {  // 如果步伐已經很小了，那麼就停止吧！
      break
    }
    let gstep = P.mul(gp, -1 * step) // gstep = 逆梯度方向的一小步
    p = P.add(p, gstep) // 向逆梯度方向走一小步
  }
  return p // 傳回最低點！
}