let ml6 = require('../../../js6/ml6/')
let ma6 = require('../../../js6/ma6/')
let knn = ml6.knn
let QA = [
  {Q: [0, 0], A: ['L']},
  {Q: [0, 1], A: ['L']},
  {Q: [1, 0], A: ['L']},
  {Q: [1, 1], A: ['L']},
  {Q: [8, 0], A: ['H']},
  {Q: [8, 1], A: ['H']},
  {Q: [9, 0], A: ['H']},
  {Q: [9, 1], A: ['H']}
]

knn.loadQA(QA)

var distance = function (a, b) {
  var dist = ma6.euclidDistance(a, b)
  return dist
}

var k = 3
var neighbors = knn.kNearestNeighbors([1, 2], distance, k)
console.log(JSON.stringify(neighbors))
