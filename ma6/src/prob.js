const P = module.exports = {}

P.random = function (min=0, max=1) {
  return min + Math.random()*(max-min)
}

P.randomInt = function (min, max) {
  return Math.floow(P.random(min, max))
}

P.randomChoose = function (a) {
  return a[P.randomInt(0, a.length)]
}

P.runif = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

P.rnorm = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

P.rnorm = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}
