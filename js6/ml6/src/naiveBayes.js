const ma6 = require('../../ma6')
const {argmax} = ma6
const M = module.exports = {}

// P(C|F1...Fn) = P(C) * P(F1|C) * ....* P(Fn|C)
M.naiveBayesProb = function (prob, c, f) {
  let p = prob[c]
  for (let fi of f) p = p*prob[c+'=>'+fi]
  return p
}

M.naiveBayesClassifier = function (prob, c, f) {
  const p = c.map((ci) => M.naiveBayesProb(prob, ci, f))
  for (let i=0; i<c.length; i++) {
    console.log('P(%s|f1,f2) = ', c[i], p[i].toFixed(3))
  }
  const {max:pmax, index: imax} = argmax(p)
  console.log('%s 的機率最大', c[imax])
}

