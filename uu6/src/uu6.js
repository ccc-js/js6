const uu6 = module.exports = require('./object')

uu6.mixin(uu6, 
  require('./array'),
  require('./error'),
  require('./object'),
  require('./string'),
  require('./control'),
)