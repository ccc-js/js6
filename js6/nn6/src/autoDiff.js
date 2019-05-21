const NetFunction = require('./NetFunction')

var symTable = {};
var tokens = [];
var tokenIdx = 0;
// 本來應該用 .*? 來比對 /*...*/ 註解的，但 javascript 的 . 並不包含 \n, 因此用 \s\S 代替 . 就可以了。
var retok = /(\/\*[\s\S]*?\*\/)|(\/\/[^\r\n])|(\d+)|([a-zA-Z]\w*)|(\r?\n)|(.)/gm; // *?, +? non greedy, m for multiline
var debug = console.log

var scan=function(text) { 
  tokenIdx = 0;
  tokens = text.match(retok); 
  return tokens; 
}

var error=function(o) {  debug("Error: %j\n", o); }

var next=function(o) {
  if (isNext(o))
    return tokens[tokenIdx++];
  error(token);
}

var isNext=function(o) {
  if (tokenIdx >= tokens.length) 
    return false;
  var token = tokens[tokenIdx];
  if (o instanceof RegExp) {
    return token.match(o);
  } else {
    return (token == o);
  }
}

var netOp = function (op, node1, node2) {
  var r = null
  switch (op) {
    case '+': r = net.add(node1, node2); break; 
    case '-': r = net.sub(node1, node2); break; 
    case '*': r = net.mul(node1, node2); break;
    case '/': r = net.div(node1, node2); break; 
    case '^': r = net.pow(node1, node2); break; 
    default : error('netOp:%s not supported!')
  }
  return r
}

var E=function() { // E=F ([+-*/^] E)
  let t1 = F()
  if (isNext(/[\+\-\*\/\^]/)) {
    let op = next(/[\+\-\*\/\^]/)
    let t2 = E()
    let t = netOp(op, t1, t2)
    t1 = t
  }
  return t1
}

var netCall = function (fname, args) {
  let f = net[fname].bind(net) // f 是 net.fname 綁定 net 物件的結果 (不綁定會錯！)
  return f(...args)
}

var CALL = function (id) {
  next("(")
  let args = []
  while (!isNext(")")) {
    let e = E()
    args.push(e)
    if (isNext(",")) next(",")
  }
  next(")")
  return netCall(id, args)
}

var reNumber = /\d+/
var reId = /[a-zA-Z]\w*/

var F=function() {  // F=( E ) | NUMBER | ID | ID(ELIST)
  if (isNext("(")) {
    next("(");
    f = E();
    next(")");
  } else if (isNext(reNumber)) {
    number = next(reNumber);
    f = net.constant(parseFloat(number))
  } else if (isNext(reId)) {
    id = next(reId)
    if (isNext("(")) {
      f = CALL(id)
    } else {
      if (symTable[id] == null) {
        f = symTable[id] = net.variable(0)
      }
    }
  }
  return f
}

var net = null

var compile=function(text) {
  net = new NetFunction()
  scan(text);
  debug("text=%s", text);
  debug("tokens=%j", tokens);
  E();
  debug("symTable=%j", symTable);
  net.symTable = symTable
  return net
}

module.exports = { compile }

/*
const nn6 = require('../../../js6/nn6')
const net = new nn6.Net()

let x  = net.variable(2)
let y  = net.variable(1)
let x_1= net.sub(x, net.constant(3))
let x2 = net.mul(x_1, x_1)
let y2 = net.mul(y, y)
let o  = net.add(x2, y2)

net.watch({x,y,o})

module.exports = net
*/
