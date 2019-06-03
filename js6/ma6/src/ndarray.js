const T = require('./tensor')
const M = module.exports = {}

M.toTensor = function (o) {
  return T.ndarray2tensor(o)
}
