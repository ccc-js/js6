const ma6 = require('../../js6/ma6')
const {V} = ma6
const D = ma6

// p0 質點所產生的重力場方程式
let p0 = [0,0,0], c= 1 // C=G*m0*m 

let f = function (p) {
  let v = V.sub(p, p0)
  let r = V.norm(v) // distance(p,p0)
  return c/r
}

let p = [1,0,0]
console.log('p=%j', p)
console.log('f(p)=%j', f(p))

// 梯度、散度、旋度
let gfp = D.grad(f, p)
console.log('grad(f, p)=%j', gfp)
let gf = D.grad(f, 3)
console.log('fgrad(f, 3)=', gf)
console.log('div(grad(f,p))=%j', D.divergence(gf, p)) // 注意：這裡用數值微分只取到一階，無法反映《引力場的拉普拉斯應該為 0》 的特性。若用自動微分應該就會是 0。
console.log('curl(grad(f,p))=', D.curl(gf, p))

// 定理檢驗
D.theoremDivGradEqLaplace(f, p)
D.theoremCurlGradZero(f, p)

// Jocobian
console.log('jocobian(grad(f,p)) = ', D.jocobian(gf, p))
console.log('jocobian(grad(f)) =', D.jocobian(gf))
