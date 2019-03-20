const ma6 = require('../../ma6')
const uu6 = require('../../uu6')

// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, p0, args={}) {
  let args2 = uu6.defaults(args, {call:ma6.Point.call, grad:ma6.Point.grad, step:ma6.Point.step, stepLen:0.01, gap:0.0001, debug:true})
  let {call, grad, step, stepLen, gap, debug} = args2
  // let p = new ma6.Point(v0)
  let p = p0
  let e0 = Number.POSITIVE_INFINITY
  while (true) {
    let e = call(f, p)
    if (debug) console.log('p=', p.toString(), 'f(p)=', e) // .toString()
    if (e > e0 - gap) break
    let g = grad(f, p) // 計算梯度 gp
    if (debug) console.log('  g=', g.toString()) // .toString()
    p = step(p, g, -1*stepLen);
    e0 = e
    /*
    let d = g.mulc(-1*step)
    if (g.norm() < gap) break
    p =  p.add(d)
    */
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