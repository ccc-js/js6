const P = module.exports = {}
const uu6 = require('../../uu6')

P.runif = uu6.random

/*
P.runif = function (n, min, max)
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

P.rnorm = function (n, min, max) {
  let r = new Array(n)
  for (let i=0;i<n;i++) r[i]=P.random(min, max)
}

*/