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
  // OO: require('./oo'),
  O: require('./O'),
  RA: require('./ratio')
  // D: require('./calculus'),
  // AD: require('../../nn6/src/autoDiff'),
  // argmax: require('./argmax'),
}

// ma6.oo = ma6.OO.oo
ma6.oo = ma6.O.oo

uu6.mixin(ma6, ma6.R, ma6.V, ma6.T, ma6.M, ma6.S, ma6.F, ma6.C, 
  require('./calculus'),
  // require('./point'),
  require('./complex'),
  require('./calculus'),
  require('./space'),
  require('./entropy'),
  require('./transform'),
  require('./optimize'),
  require('./series'),
  require('./ratio'),
  require('./ode'),
  Math,
)

