// const net = require('./perceptron')
const net = require('./mlp')

const andGate = {
  inputs: [[0,0],[0,1],[1,0],[1,1]],
  outs: [[0],[0],[0],[1]],
}
const orGate = {
  inputs: [[0,0],[0,1],[1,0],[1,1]],
  outs: [[0],[1],[1],[1]],
}
const xorGate = {
  inputs: [[0,0],[0,1],[1,0],[1,1]],
  outs: [[0],[1],[1],[0]],
}

// let g = andGate
// let g = orGate
let g = xorGate // xor 的學習不是每次都成功，若失敗的話再試一次！

net.optimize({
  inputs: g.inputs,
  outs: g.outs,
  minLoops: 2000,
  maxLoops: 100000,
  gap: 0.0000001
})
