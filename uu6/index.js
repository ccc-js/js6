const U = module.exports = {
  precision: 4,
  tab: undefined
}

U.clone = function (o) {
  let type = typeof o
  if (Array.isArray(o))
    return o.slice(0)
  else if (type === 'object')
    return {...o}
  else
    return o
}

U.json = function (o, tab, n=U.precision) {
  return JSON.stringify(o, function(key, val) {
    return val.toFixed ? Number(val.toFixed(n)) : val
  }, tab)
}

U.assert = function (cond, msg) {
  if (!cond) throw Error(msg)
}

