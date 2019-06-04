const ml6 = module.exports = {
  kmean: require('./kmean'),
  knn: require('./knn'),
  markov: require('./markov'),
  naiveBayes: require('./naiveBayes'),
  hmm:require('./hmm'),
  em:require('./em'),
  qlearning:require('./qlearning'),
  gameTheory: require('./gameTheory'),
}

let {kmean, knn, markov, naiveBayes, hmm, em, qlearning, gameTheory} = ml6

Object.assign(ml6, kmean, knn, markov, naiveBayes, hmm, em, qlearning, gameTheory)

