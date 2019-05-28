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

function vaddDirect2(a, b) {
  let len = a.length
  let c = new Array(len)
  let aisa = Array.isArray(a) 
  let bisa = Array.isArray(b) 
  for (let i=0; i<len; i++) {
    let bi = (bisa) ? b[i] : b
    let ai = (aisa) ? a[i] : a
    c[i] = ai + bi
  }
  return c
}

let op2f = function (a, b, f) {
  // let aisa = a.length == null // typeof a === 'object' // Array.isArray(a)
  // let bisa = b.length == null // typeof b === 'object' // Array.isArray(b)
  // if (aisa && bisa) return f(a,b)
  let len = a.length || b.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    // let ai = aisa ? a[i] : a
    // let bi = bisa ? b[i] : b
    let ai = a[i]
    let bi = b[i]
    r[i] = f(ai, bi)
  }
  return r
}

let vaddCall5 = (a,b)=>op2f(a,b,(x,y)=>x+y)

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

function amap2t2(op) {
  let text = `
  var ai, bi, c
  let aA = Array.isArray(a)
  let bA = Array.isArray(b)
  let len = a.length || b.length
  if (aA && bA) {
    c = new Array(len)
    for (let i=0; i<len; i++) {
      ai= a[i]
      bi= b[i]
      c[i] = ${op}
    }
    return c
  }
  if (!aA && !bA) { ai=a; bi=b; return ${op} }
  c = new Array(len)
  for (let i=0; i<len; i++) {
    ai=(aA) ? a[i] : a
    bi=(bA) ? b[i] : b
    c[i] = ${op}
  }
  return c
  `
  return new Function('a', 'b', text)
}

let vaddTemplate2 = amap2t2('ai+bi')

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
  loops(100, vaddDirect2,a, b,'vaddDirect2')
  loops(100, vaddTemplate, a, b, 'vaddTemplate')
  loops(100, vaddTemplate2, a, b, 'vaddTemplate2')
  loops(100, vaddEval,  a, b, 'vaddEval')
  loops(100, vaddCall1, a, b, 'vaddCall1')
  loops(100, vaddCall2, a, b, 'vaddCall2')
  loops(100, vaddCall3, a, b, 'vaddCall3')
  loops(100, vaddCall4, a, b, 'vaddCall4')
  loops(100, vaddCall5, a, b, 'vaddCall5')
  loops(100, vaddIn,    a, b, 'vaddIn')
}

main()

