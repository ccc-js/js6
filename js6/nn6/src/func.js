var F = module.exports = {}

F.near = function (a, b, diff=0.000001) {
  return Math.abs(a - b) < diff
}

F.neg = function (x) {
  return -x
}

F.dneg = function (o) {
  return -1
}

F.rev = function (x) {
  return 1.0 / x
}

F.drev = function (o) {
  return -1 / (o*o)
}

F.exp = function (x) {
  return Math.exp(x)
}

F.dexp = function (o) {
  return Math.exp(o)
}

// 問題是，當所有的輸出值都小於 0，就會都被 Relu 截掉，於是變成 [0,0,0....]
// 所以 relu 通常要加上 leaky 成為 leakyRelu
// 即使小於 0 也會給一個很小的梯度。
F.relu = function (x, leaky=0.05) {
  return x > 0 ? x : leaky * x
}

F.drelu = function (o, leaky=0.05) {
  return o > 0 ? 1 : leaky
}

F.sigmoid = function (x) {
  return 1 / (1 + Math.exp(-x))
}

F.dsigmoid = function (o) {
  return o * (1 - o)
}

F.tanh = function (x) {
  return Math.tanh(x)
}

F.dtanh = function (o) {
  return 1.0 - o*o
}

F.pow = function (x, y) {
  return Math.pow(x, y)
}

F.dpowx = function (x, y) {
  return y * Math.pow(x, y-1)
}

F.dpowy = function (x, y) {
  return Math.pow(x, y) * Math.log(x)
}

F.add = function (x, y) {
  return x + y
}

F.dadd = function (x, y) {
  return 1
}

F.sub = function (x, y) {
  return x - y
}

F.dsubx = function (x, y) {
  return 1
}

F.dsuby = function (x, y) {
  return -1
}

F.mul = function (x, y) {
  return x * y
}

F.dmul = function (x, y) {
  return y
}

F.div = function (x, y) {
  return x / y
}

F.ddivx = function (x, y) {
  return 1 / y
}

F.ddivy = function (x, y) {
  return -x / (y * y)
}

F.max = function (a) {
  let r = Number.MIN_VALUE
  let len = a.length
  for (let i=0; i<len; i++) {
    if (a[i] > r) r = a[i]
  }
  return r
}

// 這版的 softmax 會有 overflow, underflow 的危險 (只要總和超過幾百，或者小於幾百，就會爆了)，改一下！
// 參考： http://freemind.pluskid.org/machine-learning/softmax-vs-softmax-loss-numerical-stability/
F.softmax = function (x) {
  let len = x.length, r = new Array(len), e = new Array(len)
  let max = F.max(x), sum = 0
  for (let i=0; i<x.length; i++) {
    e[i] = Math.exp(x[i]-max)
    sum += e[i]
  }
  for (let i=0; i<x.length; i++) {
    r[i] = e[i] / sum
  }
  // console.log('Softmax: x=%j r=%j', x, r)
  return r
}

// Softmax 的梯度計算是 x.g = o.v * (1 - o.v) * o.g
F.dsoftmax = function (x, o) {
  let len = x.length
  for (let i=0; i<len; i++) {
    x.g[i] += o.v[i] * (1-o.v[i]) * o.g[i]
  }
}

