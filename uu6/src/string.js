const U = module.exports = {
  precision: 4,
  tab: undefined
}

U.json = function (o, tab, n) {
  let digits = n || this.precision || 4
  return JSON.stringify(o, function(key, val) {
    return val.toFixed ? Number(val.toFixed(digits)) : val
  }, tab)
}
