const F = module.exports = {}
const V = require('./vector')
const M = require('./matrix')
const uu6 = require('../../uu6')

// =========== Calculus =================
F.h = 0.01

// 微分 differential calculus
F.df = F.diff = function (f, x, h = F.h) {
  return (f(x+h) - f(x-h))/(2*h)
}

// 積分 integral calculus
F.i = F.integral = function (f, a, b, h = F.h) {
  var area = 0.0
  for (var x = a; x < b; x = x + h) {
    area = area + f(x) * h
  }
  return area
}

// 偏微分 partial differential calculus
// f([x1,x2,...])
F.pdiff = function (f, v, i, h = F.h) { // F.pdifferential = 
  let v2 = v.slice(0)
  v2[i] += h
  return (f(v2)-f(v))/h
}

F.pdiffn = function (f, v, i, n, h=F.h) {
  if (n === 1) return F.pdiff(f,v,i)
  let v2 = v.slice(0)
  v2[i] += h
  return (F.pdiffn(f,v2,i,n-1) - F.pdiffn(f,v,i,n-1))/h
}

// 梯度 gradient : grad(f,x)=[pdiff(f,x,0), .., pdiff(f,x,n)]
F.grad = function (f, v, h=F.h) {
  let len = v.length, fv = f(v)
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    g[i] = F.pdiff(f, v, i) // 對第 i 個變數取偏導數後，放入梯度向量 g 中
  }
  return g
}

// 散度 divergence : div(fv,x) = sum(pdiff(fv[i],v,i))
// 說明： fv=[f1,f2,...,fn] 可微分向量函數
F.div = function (fv, v) {
  console.log('div:fv=', fv)
  let len = v.length, d = new Array(len)
  for (var i = 0; i < len; i++) {
    d[i] = F.pdiff(fv[i], v, i)
  }
  return V.sum(d)
}

F.divergence = F.div

F.is3D = function (fv, v) {
  if (fv.length !== 3 || v.length !== 3) throw Error('curl(fv, v): dimension should be 3')
}

// 旋度 curl : curl(fv, x) = [pf32-pf23,pf13-pf31,pf21-pf12]
F.curl = F.curlance = function (fv, v) {
  F.is3D(fv, v);
  let pf = function (i,j) { return F.fpdiff(fv[i],j) }
  return [pf(2,1)(v)-pf(1,2)(v),
          pf(0,2)(v)-pf(2,0)(v),
          pf(1,0)(v)-pf(0,1)(v)]
}

// 拉普拉斯算子 : df2(x) + df2(y) + ....
F.laplaceOperator = function(f, v) {
  let len = v.length, df2=new Array(len)
  for (let i=0; i<len; i++) {
    df2[i] = F.pdiffn(f, v, i, 2)
  }
  return V.sum(df2)
}

F.jocobian = function (fv, v) {
  let len = v.length
  let J = M.new(len, len)
  for (let i=0; i<len; i++) {
    for (let j=0; j<len; j++) {
      J[i][j] = F.pdiff(fv[i], v, j)
    }
  }
  return J
}

// ===================== 函數陣列的版本 =============================

// 函數版偏微分
F.fpdiff = function (f, i, h = F.h) {
  return function pdiff(v) {
    return F.pdiff(f, v, i)
  }
}

// 函數版偏微分
F.fgrad = function (f, len) {
  let gf = new Array(len)
  for (let i=0; i<len; i++) {
    gf[i] = F.fpdiff(f, i)
  }
  return gf
}

F.fJocobian = function (fv) {
  let len = v.length
  let J = M.new(len, len)
  for (let i=0; i<len; i++) {
    for (let j=0; j<len; j++) {
      J[i][j] = F.fpdiff(fv[i], v, j)
    }
  }
  return J
}

// ============================ 積分 ================================
// 線積分： int F●dr = int F(r(t))●r'(t) dt
F.vintegral = function (F, r, a, b, dt) {
  dt = dt || F.h
  var sum = 0
  for (var t = a; t < b; t += dt) {
    sum += V.dot(F(r(t)) * F.diff(r, t, dt))
  }
  return sum
}

// 多重積分 -- multidimensional integral calculus
// f=[f1,f2,....] , a=[a1,a2,...] , b=[b1,b2,....]
F.pintegral = function (f, a, b) {
}

// ============================== 定理 ==============================

// 定理: 梯度的散度 = 拉普拉斯算子
// 注意：這裡用數值微分只取到一階，無法反映《引力場的拉普拉斯應該為 0》 的特性。若用自動微分應該就會是 0。
F.theoremDivGradEqLaplace = function (f, v) {
  let len = v.length
  let divGrad = F.divergence(F.fgrad(f, len), v)
  let laplace = F.laplaceOperator(f, v)
  console.log('div(grad(f,v))=', divGrad, ' laplace=', laplace)
  uu6.near(divGrad, laplace)
}

// 定理：梯度的旋度 = 零
F.theoremCurlGradZero = function (f, v) {
  let len = v.length
  let r= F.curl(F.fgrad(f, len), v)
  console.log('curl(grad(f,v))=', r)
  uu6.near(r, V.array(len, 0))
}

// 定理：旋度的散度 = 零
F.theoremDivCurlZero = function (f, v) {
  let len = v.length
  let r = F.div(F.curl(f, len), v)
  console.log('div(curl(f,v))=',r)
  uu6.near(r, V.array(len, 0))
}

// 定理：int j6●dr  = int(sum(Qxi dxi))

// 向量保守場： F=grad(f) ==> int j6●dr = f(B)-f(F)

// 定理： 向量保守場 F, pdiff(Qxi,xj) == pdiff(Qxj,xi)  for any i, j
// ex: F=[x^2y, x^3] 中， grad(F)=[x^2, 3x^2] 兩者不相等，所以不是保守場

// 格林定理：保守場中 《線積分=微分後的區域積分》
// int P h + Q dy = int int pdiff(Q,x) - pdiff(P, y) h dy

// 散度定理：通量 = 散度的區域積分
// 2D : int j6●n ds = int int div F h dy
// 3D : int int j6●n dS = int int int div F dV

// 史托克定理：  F 在曲面 S 上的旋度總和 = F 沿著邊界曲線 C 的線積分
// int int_D curl(F)●n dS = int_C j6●dr
