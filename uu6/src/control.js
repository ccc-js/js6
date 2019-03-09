const U = module.exports = {}

U.repeats = function (n, f) {
  let r = []
  for (let i=0; i<n; i++) {
    r.push(f())
  }
  return r
}
