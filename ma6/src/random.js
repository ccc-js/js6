const U = module.exports = {}

U.random = function (min=0, max=1) {
  return min + Math.random()*(max-min)
}

U.randomInt = function (min, max) {
  return Math.floow(P.random(min, max))
}

U.randomChoose = function (a) {
  return a[P.randomInt(0, a.length)]
}
