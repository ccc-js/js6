const Generator = require('./Generator')
const compiler = require('./compiler')
const uu6 = require('../../uu6')

class Parser extends Generator {
  constructor() {
    super()
  }
  eq (t) {
    return ['eq', t]
  }
  op1 (op, t) {
    return ['op1', op, t]
  }
  op2 (op, t1, t2) {
    return ['op2', op, t1, t2]
  } 
  call (fname, args) {
    return ['call', fname, args]
  }
  number (n) {
    return ['number', n]
  }
  variable (name) {
    return ['variable', name]
  }
}

let parse = function(text) {
  let g = new Parser()
  return compiler.compile(text, g)
}

module.exports = { Parser, parse }