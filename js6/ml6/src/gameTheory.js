class Player {
  constructor(arg) {
    let {i, ep, L} = arg
    this.i = i
    this.L = L
    this.ep = ep // 對方坦白的機率 p[ei, 1] = ep, 對方抵賴的機率 p[ei, 0] = 1-ep
  }
  action () {
    var lF, lT, {i, ep, L} = this
    if (i === 0) {
      //              我 對               我 對
      lF = (1-ep) * L[0][0][i] + (ep) * L[0][1][i]   // 我方抵賴 : 對方抵賴*我方的損失 + 對方坦白*我方的損失
      lT = (1-ep) * L[1][0][i] + (ep) * L[1][1][i]   // 我方坦白 : 對方抵賴*我方的損失 + 對方坦白*我方的損失  
    } else if (i === 1) {
      //              對 我               對 我
      lF = (1-ep) * L[0][0][i] + (ep) * L[1][0][i]   // 我方抵賴 : 對方抵賴*我方的損失 + 對方坦白*我方的損失
      lT = (1-ep) * L[0][1][i] + (ep) * L[1][1][i]   // 我方坦白 : 對方抵賴*我方的損失 + 對方坦白*我方的損失  
    }
    // console.log('%d: lF=%d lT=%d', i, lF, lT)
    return (lT > lF) ? 'T' : 'F'  // 坦白的期望損失小就坦白，抵賴的期望損失小就抵賴
  }
  get (eAction) {
    let {ep} = this
    if (eAction == 'T') ep += 0.01; else ep -= 0.01
    if (ep > 1) ep = 1
    if (ep < 0) ep = 0
    this.ep = ep
  }
}

function game22(args) {
  let {maxLoops, ep0, ep1, name} = args
  console.log('================Game : %s======================', name)
  let p0 = new Player({i:0, ep:ep0, L:args.L})
  let p1 = new Player({i:1, ep:ep1, L:args.L})
  for (let i=0; i<maxLoops; i++) {
    let a0 = p0.action(), a1 = p1.action()
    p1.get(a0); p0.get(a1)
    console.log('a0=%s a1=%s p0.ep=%d p1.ep=%d', a0, a1, p0.ep.toFixed(4), p1.ep.toFixed(4))
    // console.log('p0=%j p1=%j', p0, p1)
  }
}

module.exports = {Player, game22}
