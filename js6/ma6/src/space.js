const S = module.exports = {}
const V = require('./vector')

S.euclidDistance = function (v1, v2) { // sqrt((v1-v2)*(v1-v2)T)
  let dv = V.sub(v1, v2)
  return Math.sqrt(V.dot(dv, dv))
}

/*

S.euclidDistance = function (v1, v2) { // sqrt((v1-v2)*(v1-v2)T)
  let dv = v1.sub(v2)
  return Math.sqrt(dv.dot(dv))
}

S.cosineSimilarity = function (v1, v2) {
  return v1.vdot(v2) / (v1.norm() * v2.norm())
}

S.manhattanDistance = function (v1, v2) { // sum(|v1-v2|)
  return v1.sub(v2).abs().sum()
}

S.chebyshevDistance = function (v1, v2) { // max(|v1-v2|)
  return v1.sub(v2).abs().max()
}
*/