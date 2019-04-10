const net = require('./seg7net')
const seg7io = require('./seg7io')

net.optimize({
  inputs: seg7io.inputs,
  outs: seg7io.outs,
  minLoops: 10000,
  maxLoops: 100000,
  gap: 0.0000001
})
