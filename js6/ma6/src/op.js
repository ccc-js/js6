const V = require('./vector')
const O = module.exports = {}

function op(a,b,op) {
  let oa = Array.isArray(a), ob = Array.isArray(b)
  if (!oa && !ob) {
    switch (op) {
      case 'add' : return function(a,b) { return a+b }
      case 'sub' : return function(a,b) { return a-b }
      case 'mul' : return function(a,b) { return a*b }
      case 'lt'  : return function(a,b) { return a<b }
      case 'and' : return function(a,b) { return a&&b }
      default : throw Error('op: %s not found!', op)
    }
  }
  if (!oa) return V['c'+op]
  if (!ob) return V[op+'c']
  return V[op]
}

O.add = function (a,b) { return op(a,b,'add')(a,b) }
O.sub = function (a,b) { return op(a,b,'sub')(a,b) }
O.mul = function (a,b) { return op(a,b,'mul')(a,b) }
O.lt  = function (a,b) { return op(a,b,'lt')(a,b) }
O.and = function (a,b) { return op(a,b,'and')(a,b) }

