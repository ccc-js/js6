const uu6 = require('../../uu6')

const ma6 = module.exports = {
  R: require('./R'),
  P: require('./probability'),
  V: require('./vector'),
  T: require('./tensor'),
  M: require('./matrix'),
  S: require('./stat'),
  F: require('./function'),
  C: require('./constant'),
  D: require('./calculus'),
  argmax: require('./argmax'),
}

uu6.mixin(ma6, ma6.R, ma6.V, ma6.T, ma6.M, ma6.S, ma6.F, ma6.C, ma6.D,
  require('./point'),
  require('./complex'),
  require('./calculus'),
  require('./space'),
  require('./entropy'),
  require('./transform'),
)
