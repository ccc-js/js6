const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
const {V} = ma6

// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, p0, args={}) {
  let args2 = uu6.defaults(args, {step:0.01, stepLen:0.01, gap:0.0001, debug:true})
  let {step, stepLen, gap, debug} = args2
  let p = p0
  let e0 = Number.POSITIVE_INFINITY
  while (true) {
    let e = f(p)
    if (debug) console.log('p=', p.toString(), 'f(p)=', e) // .toString()
    if (e > e0 - gap) break
    let g = ma6.grad(f, p) // 計算梯度 gp
    if (debug) console.log('  g=', g.toString()) // .toString()
    p = V.add(p, V.mul(g, -1*stepLen))
    e0 = e
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent
