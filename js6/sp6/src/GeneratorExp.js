class Generator {
  op (op, t1, t2) { throw Error('Generator.op not implemented!') } 
  call (fname, args) { throw Error('Generator.call not implemented!') } 
  number (n) { throw Error('Generator.number not implemented!') } 
  variable (name) { throw Error('Generator.variable not implemented!') } 
}

module.exports = Generator
