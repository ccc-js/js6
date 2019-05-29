var ml6 = require('../../../js6/ml6')
var kmean = ml6.kmean
var data = [
  [0, 0], [0, 1], [1, 0], [1, 1],
  [8, 0], [8, 1], [9, 0], [9, 1],
  [5, 7], [4, 6], [5, 6], [4, 7]
]

kmean.run(data, 3, 10)
