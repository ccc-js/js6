const sp6 = require('../../../js6/sp6')

class NetGenerator extends sp6.Generator {
  /*
  init() {
    this.net = new NetFunction()
  }
  */
  op (op, t1, t2) {
    let {net} = this
    let r = null
    switch (op) {
      case '+': r = net.add(t1, t2); break; 
      case '-': r = net.sub(t1, t2); break; 
      case '*': r = net.mul(t1, t2); break;
      case '/': r = net.div(t1, t2); break; 
      case '^': r = net.pow(t1, t2); break; 
      default : throw Error('op:%s not supported!')
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
    let {symTable, net} = this
    if (symTable[name] == null) {
      symTable[name] = net.variable(0)
    }
    return symTable[name]
  }
}
