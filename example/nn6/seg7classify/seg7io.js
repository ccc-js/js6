const inputs = [
// A B C D E F G 
  [1,1,1,1,1,1,0], // 0
  [0,1,1,0,0,0,0], // 1
  [1,1,0,1,1,0,1], // 2
  [1,1,1,1,0,0,1], // 3
  [0,1,1,0,0,1,1], // 4
  [1,0,1,1,0,1,1], // 5
  [1,0,1,1,1,1,1], // 6
  [1,1,1,0,0,0,0], // 7
  [1,1,1,1,1,1,1], // 8
  [1,1,1,1,0,1,1], // 9
]
  
const outs = [
  0, // 0
  1, // 1
  2, // 2
  3, // 3
  4, // 4
  5, // 5
  6, // 6
  7, // 7
  8, // 8
  9, // 9
]

module.exports = {inputs, outs}