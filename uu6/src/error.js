const U = module.exports = {}

U.assert = U.be = function (cond, msg) {
  if (!cond) throw Error(msg)
}
