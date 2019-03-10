const U = module.exports = {}
const C = require('./control')

U.random = function (min=0, max=1) {
  return min+Math.random()*(max-min)
}

U.randomInt = function (min, max) {
  return Math.floow(U.random(min, max))
}

U.randomChoose = function (a) {
  return a[U.randomInt(0, a.length)]
}
