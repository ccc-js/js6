// 參考： 自然語言處理 -- Hidden Markov Model http://cpmarkchang.logdown.com/posts/192352
const M = module.exports = {}

M.markovSeqProb = function (P, s) {
  let p = P[s[0]]
  for (let i=1; i<s.length; i++) {
    let key = s[i-1]+'=>'+s[i]
    p = p * P[key]
  }
  return p
}


M.metropolisHasting = function  (P, S) {
  var Q = P // 初始機率分佈
  var A = {} // 入出比 = 流入/流出
  do {
    console.log('Q = %j', Q)
    var Qn = {}
    for (let x of S) { // 計算 A 矩陣 = 入出比 = 流入/流出
      for (let y of S) {
        Qn[x+'=>'+y] = Q[x+'=>'+y]
        A[x+'=>'+y] = (P[y] * Q[y+'=>'+x]) / (P[x] * Q[x+'=>'+y]) // 入出比 = 流入/流出
        console.log('x=%s y=%s, A[x=>y]=%d P[y]*Q[y=>x]=%d P(x)*Q[x=>y]=%d', x, y, A[x+'=>'+y], P[x]*Q[x+'=>'+y], P[y]*Q[y+'=>'+x])
      }
    }
    console.log('A = %j', A)
    var diff = 0
    for (let x of S) {
      for (let y of S) { // 計算下一代 Qn 矩陣
        if (A[x+'=>'+y] < 1) {  // 入出比 < 1 ，代表流入太少，流出太多
          Qn[x+'=>'+y] = Q[x+'=>'+y] * A[x+'=>'+y] // 降低流出量
          Qn[x+'=>'+x] = Qn[x+'=>'+x] + Q[x+'=>'+y] * (1 - A[x+'=>'+y]) // 『規一化』調整
          diff += Math.abs(Qn[x+'=>'+y] - Q[x+'=>'+y]) // 計算新舊矩陣差異
        }
      }
    }
    Q = Qn
    console.log('diff = %d', diff)
  } while (diff > 0.001)  // 假如差異夠小的時候，就可以停止了。
}

/* 這是特用的，改寫成通用的！
function gibbs (P) {
  var P0 = {'a': P['a'], 'b': P['b'] }
  do {
    var P1 = { // 下一輪的機率分布。
      'a': P0['a'] * P['a=>a'] + P0['b'] * P['b=>a'], 
      'b': P0['a'] * P['a=>b'] + P0['b'] * P['b=>b']
    }
    console.log('P1 = %j', P1)
    var da = P1['a'] - P0['a'], db = P1['b'] - P0['b'] // 兩輪間的差異。
    var step = Math.sqrt(da * da + db * db) // 差異的大小
    P0 = P1
  } while (step > 0.001)  // 假如差異夠小的時候，就可以停止了。
  console.log('標準答案:P(a)=5/8=%d P(b)=3/8=%d', 5 / 8, 3 / 8) // 印出標準答案，以便看看我們找到的答案是否夠接近。
}
*/