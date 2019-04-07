
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

function randn(n) {
  let a = []
  for (let i=0; i<n; i++) a.push(Math.random()*100)
  return a
}

function loops(n, f, a, b, fname) {
  let start = Date.now()
  for (let i=0; i<n; i++) {
    f(a,b)
  }
  let finished = Date.now()
  console.log(`${fname} time:${finished-start} ms`)
}

const nj = require('numjs')
const na = nj.random([size])
const nb = nj.random([size])

function vaddNumjs(a,b) {
  return a.add(b)
}

function main() {
  let a = randn(size)
  let b = randn(size)

  loops(1000, vaddMap,   a, b, 'vaddMap')
  loops(1000, vaddNumjs, na, nb, 'vaddNumjs')
  loops(1000, vaddDirect,a, b, 'vaddDirect')
  loops(1000, vaddTemplate, a, b, 'vaddTemplate')
  loops(1000, vaddEval,  a, b, 'vaddEval')
  loops(1000, vaddCall1, a, b, 'vaddCall1')
  loops(1000, vaddCall2, a, b, 'vaddCall2')
  loops(1000, vaddCall3, a, b, 'vaddCall3')
  loops(1000, vaddCall4, a, b, 'vaddCall4')
  loops(1000, vaddIn,    a, b, 'vaddIn')
}

main()

