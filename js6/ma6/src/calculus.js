const F = module.exports = {}
const V = require('./vector')
const M = require('./matrix')
const uu6 = require('../../uu6')

// =========== Calculus =================
F.h = 0.01

// n 次微分 : 參考 https://en.wikipedia.org/wiki/Finite_difference
F.diffn = function (f, n, x=null, h=F.h) {
  uu6.member(n >= 0)
  if (n === 0) return f(x)
  h = h/2 // 讓 1, 2, .... n 次微分的最大距離都一樣
  var x1 = (x==null) ? null : x+h
  var x_1 = (x==null) ? null : x-h
  return (F.diffn(f,n-1,x1) - F.diffn(f,n-1,x_1))/(2*h)
}

F.diff = function (f, x, h=F.h) { return F.diffn(f, 1, x, h) }

// n 階偏導數
F.pdiffn = function (f, i, n, v, h=F.h) {
  if (n === 0) return f(v)
  h = h/2 // 讓 1, 2, .... n 次微分的最大距離都一樣
  let d = function (f, i, n, v) {
    let v1 = null, v_1 = null
    if (v != null) {
      v1 = v.slice(0); v1[i] += h
      v_1= v.slice(0); v_1[i]-= h
    }
    return (F.pdiffn(f,i,n-1,v1) - F.pdiffn(f,i,n-1,v_1))/(2*h)
  }
  return (v == null) ? d : d(f, i, n, v)
}

F.pdiff = function (f, i, x, h=F.h) { return F.pdiffn(f, i, 1, x, h) }

// 梯度 gradient : grad(f,x)=[pdiff(f,x,0), .., pdiff(f,x,n)]
F.grad = function (f, v, h=F.h) {
  let len = (typeof v == 'number') ? v : v.length
  let vt =  (typeof v == 'number') ? null : v
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    g[i] = F.pdiff(f, i, vt) // 對第 i 個變數取偏導數後，放入梯度向量 g 中
  }
  return g
}

// 散度 divergence : div(fv,x) = sum(pdiff(fv[i],v,i))
// 說明： fv=[f1,f2,...,fn] 可微分向量函數
F.divergence = function (fv, v) {
  console.log('div:fv=', fv)
  let len = v.length, d = new Array(len)
  for (var i = 0; i < len; i++) {
    d[i] = F.pdiff(fv[i], i, v)
  }
  return V.sum(d)
}

// F.divergence = F.div

F.is3D = function (fv, v) {
  if (fv.length !== 3 || v.length !== 3) throw Error('curl(fv, v): dimension should be 3')
}

// 旋度 curl : curl(fv, x) = [pf32-pf23,pf13-pf31,pf21-pf12]
F.curl = F.curlance = function (fv, v) {
  F.is3D(fv, v);
  let pf = function (i,j) { return F.pdiff(fv[i],j) }
  return [pf(2,1)(v)-pf(1,2)(v),
          pf(0,2)(v)-pf(2,0)(v),
          pf(1,0)(v)-pf(0,1)(v)]
}

// 拉普拉斯算子 : df2(x) + df2(y) + ....
F.laplaceOperator = function(f, v) {
  let len = v.length, df2=new Array(len)
  for (let i=0; i<len; i++) {
    df2[i] = F.pdiffn(f, i, 2, v)
  }
  return V.sum(df2)
}

F.jocobian = function (fv, v) {
  let len = fv.length
  let J = M.new(len, len)
  for (let i=0; i<len; i++) {
    for (let j=0; j<len; j++) {
      J[i][j] = F.pdiff(fv[i], j, v)
    }
  }
  return J
}

// ============================ 積分 ================================
// 積分 integral calculus
F.i = F.integral = function (f, a, b, h = F.h) {
  var area = 0.0
  for (var x = a; x < b; x = x + h) {
    area = area + f(x) * h
  }
  return area
}

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
  let divGrad = F.divergence(F.grad(f, len), v)
  let laplace = F.laplaceOperator(f, v)
  console.log('div(grad(f,v))=', divGrad, ' laplace=', laplace)
  uu6.near(divGrad, laplace)
}

// 定理：梯度的旋度 = 零
F.theoremCurlGradZero = function (f, v) {
  let len = v.length
  let r= F.curl(F.grad(f, len), v)
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



/*
// 微分 differential calculus
F.df = F.diff = function (f, x=null, h = F.h) {
  h = h/2
  let d = function (x) { return (f(x+h) - f(x-h))/(2*h) }
  return (x == null) ? d : d(x)
}

// 二次微分 differential calculus，比連續用兩次一階微分更準確
F.df2 = F.diff2 = function (f, x=null, h = F.h) {
  h = h/2
  let d = function (x) { return ((f(x+h) - 2*f(x) + f(x-h))/h)/h }
  return (x == null) ? d : d(x)
}
*/

/*
// 偏導數 partial differential calculus
// f([x1,x2,...])
F.pdiff = function (f, i, v=null, h = F.h) {
  let d = function (v) {
    let v2 = v.slice(0)
    v2[i] += h
    return (f(v2)-f(v))/h
  }
  return (v==null) ? d : d(v)
}

// 二階偏導數逼近，比連續使用一階準確
F.pdiff2 = function (f, i, v=null, h = F.h) {
  let d = function (v) {
    let v1 = v.slice(0), v_1 = v.slice(0)
    v1[i] += h; v_1[i] -= h
    return ((f(v1)-2*f(v)+f(v_1))/h)/h
  }
  return (d==null) ? d : d(v)
}
*/


/*
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
*/
