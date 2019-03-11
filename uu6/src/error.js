const U = module.exports = {}

U.assert = function (cond, msg) {
  if (!cond) throw Error(msg)
}

U.be = U.assert

U.is = function (o, type) {
  if (type==='array' && Array.isArray(o)) return true
  return typeof o === type
}

