const U = module.exports = {}

U.clone = function (o) {
  let type = typeof o
  if (Array.isArray(o))
    return o.slice(0)
  else if (type === 'object')
    return {...o}
  else
    return o
}

U.omap2 = function (o1, o2, f) {
  let o = {}
  for (let k in o1) {
    o[k] = f(o1[k], o2[k])
  }
  return o
}

U.array2map = function (a) {
  let map = {}
  for (let i in a) {
    map[i] = a[i]
  }
  return map
}

U.key2value = function (o) {
  let r = {}
  for (let k in o) {
    let v = o[k]
    r[v] = k 
  }
  return r
}
