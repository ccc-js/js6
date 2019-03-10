const U = module.exports = {
  V: require('../nu6/bak/Vector')
}

Object.assign(U, 
  require('./src/array'),
  require('./src/error'),
  require('./src/object'),
  require('./src/omap'),
  require('./src/string'),
  require('./src/random'),
  require('./src/control'),
)
