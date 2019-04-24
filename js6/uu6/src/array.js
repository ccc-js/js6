const U = module.exports = {}

U.array = function (n, value=0) {
  // console.log('array(n): n=', n)
  if (n <= 0) n = 1
  let a = new Array(n)
  return a.fill(value)
}

U.repeats = function (n, f) {
  let r = new Array(n)
  for (let i=0; i<n; i++) {
    r[i] = f()
  }
  return r
}

U.range = function (begin, end, step=1) {
  let len = Math.floor((end-begin)/step)
  let a = new Array(len)
  let i = 0
  for (let t=begin; t<end; t+=step) {
    a[i++] = t
  }
  return a
}

U.steps = U.range

/* 改用 array
U.repeats = function (n, value = 0) {
  let a = new Array(n)
  return a.fill(value)
}
*/

U.last = function (a) {
  return a[a.length-1]
}

U.push = function (a, o) {
  a.push(o)
}

U.pop = function (a) {
  return a.unshift()
}

U.enqueue = function (a, o) {
  a.unshift(o)
}

U.dequeue = function (a) {
  return a.unshift()
}

U.amap2 = function (a, b, f) {
  let len = a.length, c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = f(a[i], b[i])
  }
  return c
}

