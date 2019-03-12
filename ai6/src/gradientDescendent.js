const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, v0, args={}) {
  let args2 = uu6.defaults(args, {call:ma6.Point.call, grad:ma6.Point.grad, step:0.01, gap:0.0001, debug:true})
  let {call, grad, step, gap, debug} = args2
  let p = new ma6.Point(v0)
  while (true) {
    let e = call(f, p)
    if (debug) console.log('p=', p, 'f(p)=', e) // .toString()
    let g = grad(f, p) // 計算梯度 gp
    if (debug) console.log('  g=', g) // .toString()
    let d = g.mulc(-1*step)
    if (g.norm() < gap) break
    p =  p.add(d)
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent

/*
    //console.log('d=', d)
    let p2 = p.add(d)
    let e2 = call(f, p2)
    console.log('e=', e, 'e2=', e2, 'p2=', p2)
    //process.exit(1)
    // if (e2 > e - gap) break
*/