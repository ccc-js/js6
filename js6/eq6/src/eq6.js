const uu6 = require('../../uu6')

const eq6 = module.exports = {
  F:require('./functions'),
  E:require('./equations'),
  S:require('./solve'),
}

uu6.mixin(eq6, eq6.E, eq6.F, eq6.S)