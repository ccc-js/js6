const uu6 = require('../../uu6')

const ma6 = module.exports = {
  P: require('./probability'),
  V: require('./vector'),
  T: require('./tensor'),
  M: require('./matrix'),
  S: require('./stat'),
  F: require('./function'),
  C: require('./constant'),
}

uu6.mixin(ma6, ma6.P, ma6.V, ma6.T, ma6.M, ma6.S, ma6.F, ma6.C, 
  require('./point'),
  require('./complex'),
)
