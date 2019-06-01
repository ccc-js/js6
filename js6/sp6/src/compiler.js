const {isNext, next, tokenize} = require('./lexer')
const reNumber = /\d+/
const reId = /[a-zA-Z]\w*/

// EQS = EQ([;] EQ)*
var EQS = function() {
  let eqs = ['eqs']
  let e = EQ()
  eqs.push(e)
  g.eq(e)
  while (isNext(/[;]/)) {
    next(/[;]/)
    e = EQ()
    eqs.push(e)
    g.eq(e)
  }
  return eqs
}

// EQ= E([=] E)*
var EQ = function() {
  let t1 = E()
  let op = next(/[=]/)
  let t2 = E()
  let t = g.op2('=', t1, t2)
  return t
/*
  while (isNext(/[=]/)) {
    let op = next(/[=]/)
    let t2 = E()
    let t = g.op2(op, t1, t2)
    t1 = t
  }
  return t1
*/
}

// E=T ([+-] T)*
var E = function() {
  let t1 = T()
  while (isNext(/[\+\-]/)) {
    let op = next(/[\+\-]/)
    let t2 = T()
    let t = g.op2(op, t1, t2)
    t1 = t
  }
  return t1
}

// T=P ([*/^] P)*
var T = function() {
  let t1 = P()
  while (isNext(/[\*\/\^]/)) {
    let op = next(/[\*\/\^]/)
    let t2 = P()
    let t = g.op2(op, t1, t2)
    t1 = t
  }
  return t1
}

var P=function() {
  if (isNext("-")) {
    next("-");
    let f = F();
    return g.op1('-', f)
  }
  return F()
}

var F=function() {  // F= ( E ) | NUMBER | ID | ID(ELIST) | -E 
  if (isNext("(")) {
    next("(");
    f = E();
    next(")");
  } else if (isNext(reNumber)) {
    number = next(reNumber);
    f = g.number(parseFloat(number))
  } else if (isNext(reId)) {
    id = next(reId)
    if (isNext("(")) {
      f = CALL(id)
    } else {
      return g.variable(id)
    }
  } /* else if (isNext("-")) {
    next("-");
    let e = E();
    f = g.op1('-', e)
  }*/
  return f
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
  return g.call(id, args)
}

let g = null

var compile=function(text, g0) {
  g = g0
  let tokens = tokenize(text)
  // console.log('tokens=%j', tokens)
  return EQS()
}

module.exports = { compile }
