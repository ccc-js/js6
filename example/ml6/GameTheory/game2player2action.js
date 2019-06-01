// 1st:  Coin B, {HTTTHHTHTH}, 5H,5T
// 2nd:  Coin A, {HHHHTHHHHH}, 9H,1T
// 3rd:  Coin A, {HTHHHHHTHH}, 8H,2T
// 4th:  Coin B, {HTHTTTHHTT}, 4H,6T
// 5th:  Coin A, {THHHTHHHTH}, 7H,3T
// so, from MLE: pA(heads) = 0.80 and pB(heads)=0.45

const ml6 = require('../../../js6/ml6')
const ma6 = require('../../../js6/ma6')
const {V} = ma6
// 參考 -- https://wiki.mbalib.com/zh-tw/%E5%8D%9A%E5%BC%88%E8%AE%BA
// ============== 囚徒困境矩陣 (坦白) =======================
//         p1 抵賴      p1 坦白
//        p0損 p1損    p0損 p1損
var P1 = [[[-1,  -1],  [-10,  0]],  // p0 抵賴
          [[ 0, -10],  [-8,  -8]]]  // p0 坦白

// ============== 囚徒合作矩陣 (抵賴) =======================
//         p1 抵賴      p1 坦白
//        p0損 p1損    p0損 p1損
var P2 = [[[ 0,   0],  [ -5, -5]],  // p0 抵賴
          [[-5,  -5],  [-10,-10]]]  // p0 坦白

// ======== 囚徒隨意矩陣 (未知: 初始信賴度是關鍵) ============
//         p1 抵賴      p1 坦白
//        p0損 p1損    p0損 p1損
var P3 = [[[ 0,   0],  [-8, -8]],  // p0 抵賴
          [[-8,  -8],  [-5, -5]]]  // p0 坦白

// ======== 智豬博弈矩陣 () ===========================
// https://zh.wikipedia.org/wiki/%E6%99%BA%E7%8C%AA%E5%8D%9A%E5%BC%88
//             按按鈕	     等待
//           p0益 p1益   p0益 p1益
var Pig1 = [[[ 5,  1],  [ 4,  4]],  // 按按鈕
            [[ 9, -1],  [ 0,  0]]]  // 等待

// ================ 零和遊戲 () ===========================
// https://en.wikipedia.org/wiki/Zero-sum_game
var ZeroSum1 = [[[ -1,  1],  [ 2,  -2]],
                [[ -2,  2],  [ 1,  -1]]]

// ================ 零和遊戲 () ===========================
var ZeroSum2 = [[[ -1,  1],  [ 2,  -2]],
                [[ -2,  2],  [ 5,  -5]]]

// ================ 合作駕駛 () ===========================
// https://en.wikipedia.org/wiki/Nash_equilibrium
var DriverGood = [[[ 10, 10],  [ 0,  0]],
                  [[  0,  0],  [10,  10]]]

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


function game(args) {
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

game({ep0:0.1, ep1:0.1, maxLoops:20, L:P1, name: "囚徒坦白"})
game({ep0:0.9, ep1:0.9, maxLoops:20, L:P2, name: "囚徒抵賴"})
game({ep0:0.3, ep1:0.3, maxLoops:20, L:P3, name: "囚徒有解：低信賴度"})
game({ep0:0.8, ep1:0.8, maxLoops:20, L:P3, name: "囚徒有解：高信賴度"})
game({ep0:0.5, ep1:0.5, maxLoops:20, L:Pig1, name: "智豬博弈：小豬等待，大豬去按"})
game({ep0:0.5, ep1:0.5, maxLoops:50, L:ZeroSum1, name: "零和遊戲 1"})
game({ep0:0.5, ep1:0.5, maxLoops:50, L:ZeroSum2, name: "零和遊戲 2"})
game({ep0:0.6, ep1:0.5, maxLoops:50, L:DriverGood, name: "遵行方向駕駛"})