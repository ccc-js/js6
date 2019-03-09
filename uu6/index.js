const U = module.exports = {
  V: require('./src/vector')
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
