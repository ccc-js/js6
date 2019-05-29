const F = require('./function')

class Series {
  constructor(f, p) {
    this.f = f
    this.p = p
  }

  sum(n, ...arg) {
    let r = 0
    for (let i=0; i<n; i++) {
      r += this.f(i)*this.p(i)(...arg)
      // console.log('r=', r)
    }
    return r
  }

  // forall f(i)*p(i) = y(i)
  solve(y, n) { throw Error('Series.sovle() not defined!') }
}

class PolynomialSeries extends Series {
  constructor(f) { 
    super(f, null)
    this.p = function (i) {
      return function (x) { return Math.pow(x, i) }
    }
  }
}

class Polynomial extends PolynomialSeries {
  constructor(c) {
    super(null)
    this.c = c
    this.f = function (i) {
      return (c[i] != null)? c[i] : 0
    }
  }
  sum(x) { return super.sum(this.c.length, x) }
}

class TylorSeries extends Series {
  constructor(df, x0=0) { // df(i) 代表對 f 進行 i 次微分的結果 ....
    super(null)
    this.f = function (i) {
      return df(i)(x0)/F.factorial(i)  // f^i(x0)/i!
    }
    this.p = function (i) {
      return function (x) { return Math.pow(x-x0, i) } // (x-x0)^i
    }
  }
}

let expSeries = (x0) => new TylorSeries((i)=>Math.exp, x0)
let sinSeries = (x0) => new TylorSeries(function (i) {
  let {sin, cos} = Math
  return [sin, cos, (x)=>-sin(x), (x)=>-cos(x)][i%4]
}, x0)

// https://en.wikipedia.org/wiki/Fourier_series
class FourierSeries extends Series {
  constructor(f) {
    super(f, null)
    this.p = function (n) {
      return function (x) { return C.exp(C.mul({i:n}, x)) }
    }
  }
}

module.exports = { 
  Series, PolynomialSeries, Polynomial, 
  TylorSeries, expSeries, sinSeries, 
  FourierSeries,
}
