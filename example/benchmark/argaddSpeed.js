const {loops, randn} = require('./benchmark')
const size = 100000

function vaddArg(o) {
  return o['a'] + o.b
}

function vaddListArg(c) {
  let len = c.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = vaddArg(c[i])
  }
  return r
}

function vadd(a, b) {
  return a+b
}

function vaddList(a, b) {
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = vadd(a[i], b[i])
  }
  return r
}

function loopsArg(n, f, c, fname) {
  let start = Date.now()
  for (let i=0; i<n; i++) {
    f(c)
  }
  let finished = Date.now()
  console.log(`${fname} time:${finished-start} ms`)
}

function main() {
  let a = randn(size)
  let b = randn(size)
  let c = new Array(size)
  for (let i=0; i<size; i++) c[i] = {a:a[i], b:b[i]}

  loops(100, vaddList,  a, b, 'vaddList')
  loopsArg(100, vaddListArg,  c, 'vaddListArg')
}

main()

