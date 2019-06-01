const sp6 = module.exports = {
  // symbol: require('./symbol'),
  lexer: require('./lexer'),
  Generator: require('./Generator'),
}

Object.assign(sp6, require('./parser'), require('./compiler'))