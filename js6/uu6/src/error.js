const U = module.exports = {}

U.assert = function (cond, msg='assert fail!') {
  if (!cond) throw Error(msg)
}

U.be = U.assert 

