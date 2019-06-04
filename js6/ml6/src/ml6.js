const ml6 = module.exports = {
  kmean: require('./kmean'),
  knn: require('./knn'),
  markov: require('./markov'),
  naiveBayes: require('./naiveBayes'),
}

Object.assign(ml6, require('./em'))

