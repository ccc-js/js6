const {loops, randn} = require('./benchmark')

const size = 100000

function amap2(a, b, f) {
  let len = a.length, c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = f(a[i], b[i])
  }
  return c
}

function add(x, y) {
  return x+y
}

function vaddCall1(a, b) {
  return amap2(a, b, (x,y)=>x+y)
}

function vaddCall2(a, b) {
  return amap2(a, b, function(x,y) { return x+y })
}

function vaddCall3(a, b) {
  return amap2(a, b, add)
}

function vaddCall4(a, b) {
  let len = a.length
  let c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = add(a[i], b[i])
  }
  return c
}

function vaddDirect(a, b) {
  let len = a.length
  let c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = a[i] + b[i]
  }
  return c
}

function amap2t(op) {
  let text = `
  let len = a.length
  let c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = ${op}
  }
  return c
  `
  return new Function('a', 'b', text)
}

let vaddTemplate = amap2t('a[i]+b[i]')

function vaddEval(a,b) {
  let code = `
  let len = a.length
  let c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = a[i]+b[i]
  }
  c
  `
  return eval(code)
}

function vaddIn(a, b) {
  // let c = new Array()
  let c = new Array(a.length)
  for (let i in a) {
    c[i] = a[i] + b[i]
  }
  return c
}

function vaddMap(a) {
  return a.map((x)=>x+x)
}

function main() {
  let a = randn(size)
  let b = randn(size)

  loops(100, vaddMap,   a, b, 'vaddMap')
  loops(100, vaddDirect,a, b, 'vaddDirect')
  loops(100, vaddTemplate, a, b, 'vaddTemplate')
  loops(100, vaddEval,  a, b, 'vaddEval')
  loops(100, vaddCall1, a, b, 'vaddCall1')
  loops(100, vaddCall2, a, b, 'vaddCall2')
  loops(100, vaddCall3, a, b, 'vaddCall3')
  loops(100, vaddCall4, a, b, 'vaddCall4')
  loops(100, vaddIn,    a, b, 'vaddIn')
}

main()

