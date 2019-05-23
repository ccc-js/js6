const NetFunction = require('./NetFunction')
const sp6 = require('../../sp6')
const { exp, Generator } = sp6

const S = module.exports = {}

class NetGenerator extends Generator {
  constructor() {
    super()
    this.net = new NetFunction()
  }
  op1 (op, t) {
    let {net} = this
    switch (op) {
      case '-': return net.mul(net.constant(-1), t);
      default : throw Error('op:'+op+' not supported!')
    }
  }
  op2 (op, t1, t2) {
    let {net} = this
    let r = null
    switch (op) {
      case '+': r = net.add(t1, t2); break; 
      case '-': r = net.sub(t1, t2); break; 
      case '*': r = net.mul(t1, t2); break;
      case '/': r = net.div(t1, t2); break; 
      case '^': r = net.pow(t1, t2); break; 
      default : throw Error('op2:'+op+' not supported!')
    }
    return r
  } 
  call (fname, args) {
    let {net} = this
    let f = net[fname].bind(net) // f 是 net.fname 綁定 net 物件的結果 (不綁定會錯！)
    return f(...args)
  }
  number (n) {
    return this.net.constant(n)
  }
  variable (name) {
    let {net} = this, {symTable} = net
    if (symTable[name] == null) {
      symTable[name] = net.variable(0)
    }
    return symTable[name]
  }
}

S.compile  = function(text) {
  let g = new NetGenerator()
  exp.compile(text, g)
  return g.net
}
