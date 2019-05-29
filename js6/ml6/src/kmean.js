// ref : https://dotblogs.com.tw/dragon229/2013/02/04/89919
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
const V = ma6.V, M = ma6.M
const KMean = module.exports = {}

KMean.loadData = function (data) {
  KMean.data = data
}

KMean.initialize = function (k) {
  KMean.k = k
  KMean.centers = uu6.samples(KMean.data, k)
}

KMean.grouping = function (distance) {
  var data = KMean.data
  var k = KMean.k
  var groups = Array(k).fill(0)
  var totalDist = 0
  for (var di = 0; di < data.length; di++) {
    var minDist = Number.MAX_VALUE
    var minGroup = 0
    for (var gi = 0; gi < k; gi++) {
      var dist = distance(KMean.centers[gi], data[di])
      if (dist < minDist) {
        minDist = dist
        minGroup = gi
      }
    }
    groups[di] = minGroup
    totalDist += minDist
  }
  console.log('totalDist = %d', totalDist)
  return groups
}

KMean.centering = function () {
  var data = KMean.data
  var groups = KMean.groups
  var k = KMean.k
  var counts = Array(k).fill(0)
  var newCenters = M.new(k, data[0].length)
  for (let i = 0; i < data.length; i++) {
    var gi = groups[i]
    newCenters[gi] = V.add(newCenters[gi], data[i])
    counts[gi] ++
  }
  for (let gi = 0; gi < k; gi++) {
    if (counts[gi] > 0) { // 如果 counts[gi] == 0 不能除，這一群沒有人！
      newCenters[gi] = V.div(newCenters[gi], counts[gi])
    }
  }
  return newCenters
}

KMean.run = function (data, k, maxLoop) {
  KMean.loadData(data)
  KMean.initialize(k)
  for (var i = 0; i < maxLoop; i++) {
    console.log('============== loop ' + i + '================')
    KMean.groups = KMean.grouping(ma6.euclidDistance)
    console.log('groups=%j', KMean.groups)
    KMean.centers = KMean.centering()
    console.log('centers=%j', KMean.centers)
  }
  return KMean.data
}
