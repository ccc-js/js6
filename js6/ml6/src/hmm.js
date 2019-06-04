// 參考： https://zh.wikipedia.org/wiki/%E7%BB%B4%E7%89%B9%E6%AF%94%E7%AE%97%E6%B3%95
const {argmax} = require('../../ma6')
const M = module.exports = {} 

M.viterbi = function (obs, states, P) {
  console.log('觀察到的序列=', obs)
  const T = [{}] // Viterbi Table
  let path = {}  // path[state] = 從 0 到 t 到達 state 機率最大的 path
  for (let y of states) { // # Initialize base cases (t == 0)
    T[0][y] = P[y] * P[y+'=>'+obs[0]]
    path[y] = [y]
  }
  // console.log('T=%j path=%j', T, path)
  for (let t=1; t<obs.length; t++) { // # Run Viterbi for t > 0
    T[t] = {}
    let newpath = {}
    for (let y of states) {
      let {max:prob, index:si} = argmax(states.map((y0)=>T[t-1][y0] * P[y0+'=>'+y] * P[y+'=>'+obs[t]]))
      let state = states[si]
      // console.log('y=%s prob=%d state=%s', y, prob, state)
      T[t][y] = prob
      newpath[y] = path[state].concat(y)
    }
    // console.log('t=%d T=%j', t, T)
    path = newpath
    console.log('t=%d path=%j', t, path)
  }
  let {max:prob, index:si} = argmax(states.map((y)=>T[obs.length - 1][y]))
  console.log('T=%j', T)
  return {prob, path:path[states[si]]}
}
