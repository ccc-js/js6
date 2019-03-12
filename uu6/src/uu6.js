const uu6 = module.exports = require('./object')

uu6.mixin(uu6, 
  require('./array'),
  require('./error'),
  require('./string'),
  require('./random'),
  require('./control'),
  require('./args'),
)