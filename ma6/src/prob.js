const P = module.exports = {}

P.runif = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

/*
P.rnorm = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

*/