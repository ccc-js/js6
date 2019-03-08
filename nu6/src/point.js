const P = module.exports = {}

P.clone = function (o) {
  return {...o}
}

P.add = function (p1, p2) {
  let p = {}
  for (let k in p1) {
    p[k] = p1[k] + p2[k]
  }
  return p
}

P.sub = function (p1, p2) {
  return P.add(p1, P.neg(p2))
}

P.mul = function (p1, c) {
  let p = {}
  for (let k in p1) {
    p[k] = p1[k] * c
  }
  return p
}

P.neg = function (p) {
  return P.mul(p, -1)
}

P.norm = function (p) {
  let norm = 0
  for (let k in p) {
    norm += p[k] * p[k]
  }
  return norm
}

P.str = function (p, n=4) {
  let lines = []
  for (let k in p) {
    lines.push(k+':'+p[k].toFixed(n))
  }
  return '{' + lines.join(', ') + '}'
}