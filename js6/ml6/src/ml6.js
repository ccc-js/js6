const ml6 = module.exports = {
  kmean: require('./kmean'),
  knn: require('./knn'),
}

Object.assign(ml6, require('./em'))

