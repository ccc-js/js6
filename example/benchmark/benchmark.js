
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

module.exports = { randn, loops }