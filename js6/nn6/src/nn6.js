module.exports = nn6 = {
  N: require('./node'),
  G: require('./gate'),
  L: require('./layer'),
  Net: require('./Net'),
  AD: require('./autoDiff'),
}

Object.assign(nn6, nn6.N, nn6.G, nn6.L, nn6.AD)
