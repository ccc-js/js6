const S = module.exports = {}

S.random = function (a = 0, b = 1) {
  let r = a + (Math.random() * (b - a))
  return r
}

S.randomInt = function (a, b) {
  let r = S.random(a, b + 0.999999999)
  return Math.floor(r)
}

S.sample = function (space, probs) {
  if (probs == null) return space[S.randomInt(0, space.length - 1)]
  let p = S.random(0, 1)
  let sump = 0
  for (let i = 0; i < space.length; i++) {
    sump += probs[i]
    if (p <= sump) return space[i]
  }
  throw new Error('S.sample fail!')
}

S.samples = function (space, size, arg) {
  arg = S._.defaults(arg, {replace: true})
  if (arg.replace) {
    var results = []
    for (let i = 0; i < size; i++) {
      results.push(S.sample(space, arg.prob))
    }
    return results
// return _.times(size, ()=>_.sample(space));
  } else {
    if (space.length < size) throw Error('statistics.samples() : size > space.length')
    return S._.sampleSize(space, size)
  }
}

S.normalize = function (a) {
  var sum = S.T.sum(a)
  return a.map(function (x) { return x / sum })
}
/*
S.max = S.T.max
S.min = S.T.min
S.sum = S.T.sum
S.product = S.T.product
*/
// graphics
S.curve = function (f, from = -10, to = 10, step = 0.1) {
  var x = S.steps(from, to, step)
  var y = x.map1(f)
  return {type: 'curve', x: x, y: y}
}

S.hist = function (a, from, to, step = 1) {
  from = from || a.min()
  to = to || a.max()
  var n = Math.ceil((to - from + S.EPSILON) / step)
  var xc = S.steps(from + step / 2.0, to, step)
  var bins = S.V.new(n, 0)
  for (var i in a) {
    var slot = Math.floor((a[i] - from) / step)
    if (slot >= 0 && slot < n) {
      bins[slot]++
    }
  }
  return {type: 'histogram', xc: xc, bins: bins, from: from, to: to, step: step}
}

S.ihist = function (a) {
  return S.hist(a, a.min() - 0.5, a.max() + 0.5, 1)
}